"use client";

import {useMemo, useState} from "react";
import type {ChangeEvent} from "react";
import {detectShippingZone} from "@/domain/services/shipping-zone";
import {FREE_DELIVERY_THRESHOLD, TAX_RATE} from "@/presentation/lib/constants";
import {formatIDR} from "@/presentation/lib/format";
import {Button} from "@/presentation/components/ui/button";
import {Container} from "@/presentation/components/ui/container";
import {FormField} from "@/presentation/components/ui/form-field";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {OrderSummary} from "@/presentation/components/checkout/order-summary";
import {PaymentMethodPicker, type PaymentMethodId} from "@/presentation/components/checkout/payment-method-picker";
import {WhatsAppPaymentGateway} from "@/infrastructure/payment/whatsapp-payment-gateway";
import {useCart} from "@/presentation/providers/cart-provider";
import {useUi} from "@/presentation/providers/ui-provider";

// TODO(ISSUE-14): ganti dengan AuthProvider (status login sungguhan).
const TEMP_IS_LOGGED_IN = false;

type Step = "details" | "review";

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes: string;
  paymentMethod: PaymentMethodId;
};

const INITIAL_FORM: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  province: "",
  postalCode: "",
  notes: "",
  paymentMethod: "virtual-account",
};

/** Alur checkout dua langkah — bagian 4.10 issue.md. */
export function CheckoutFlow() {
  const {items, subtotal, isHydrated} = useCart();
  const {open: openOverlay} = useUi();
  const [step, setStep] = useState<Step>("details");
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [isPaying, setIsPaying] = useState(false);

  const zone = form.city.trim() ? detectShippingZone(form.city) : undefined;
  const shippingFee = !zone
    ? null
    : zone.requiresQuote
      ? null
      : zone.freeThreshold !== null && subtotal >= zone.freeThreshold
        ? 0
        : zone.fee;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + (shippingFee ?? 0) + tax;

  const missingFields = useMemo(() => {
    const missing: string[] = [];
    if (!form.fullName.trim()) missing.push("Full name");
    if (!form.phone.trim()) missing.push("Phone number");
    if (!form.email.trim()) missing.push("Email");
    if (!form.address.trim()) missing.push("Street address");
    if (!form.city.trim()) missing.push("City");
    return missing;
  }, [form]);

  const canReview = missingFields.length === 0;

  function updateField<K extends keyof CheckoutForm>(key: K) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({...prev, [key]: event.target.value}));
    };
  }

  async function handlePay() {
    setIsPaying(true);
    const gateway = new WhatsAppPaymentGateway();
    const result = await gateway.createOrder({
      customerName: form.fullName,
      customerPhone: form.phone,
      customerEmail: form.email,
      shippingAddress: [form.address, form.city, form.province, form.postalCode]
        .filter(Boolean)
        .join(", "),
      shippingZoneName: zone?.name ?? "Unknown",
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        color: item.colorLabel,
        qty: item.qty,
        price: item.price,
      })),
      subtotal,
      shippingFee,
      tax,
      total,
    });

    if (result.redirectUrl) {
      window.location.assign(result.redirectUrl);
    } else {
      setIsPaying(false);
    }
  }

  if (isHydrated && items.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-4 py-30 text-center">
        <p className="font-display text-h3">Your bag is empty</p>
        <p className="text-sm text-muted">Add a piece to your bag before checking out.</p>
        <TextLink href="/shop">EXPLORE THE SHOP</TextLink>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <nav className="flex items-center gap-2 text-xs uppercase tracking-label text-muted">
        <button type="button" onClick={() => openOverlay("cart")} className="hover:text-ink">
          Bag ({items.reduce((sum, item) => sum + item.qty, 0)})
        </button>
        <span aria-hidden="true">›</span>
        <button
          type="button"
          onClick={() => setStep("details")}
          disabled={step === "details"}
          className={step === "details" ? "text-ink" : "hover:text-ink"}
        >
          Details
        </button>
        <span aria-hidden="true">›</span>
        <span className={step === "review" ? "text-ink" : undefined}>Review</span>
      </nav>

      {!TEMP_IS_LOGGED_IN ? (
        <div className="mt-8 border border-hairline bg-warm p-6">
          <p className="text-sm">Save this to your account</p>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            <li>Track your delivery in real time</li>
            <li>View and repeat past purchases</li>
            <li>Save pieces to your wishlist</li>
          </ul>
          <TextLink onClick={() => openOverlay("account")} className="mt-3 inline-block">
            Create Account or Sign In →
          </TextLink>
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_auto]">
        <div className="lg:w-175">
          {step === "details" ? (
            <div className="space-y-10">
              <section className="space-y-6">
                <h2 className="font-display text-h3">Contact</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField label="Full Name" value={form.fullName} onChange={updateField("fullName")} />
                  <FormField
                    label="Phone (WhatsApp)"
                    type="tel"
                    value={form.phone}
                    onChange={updateField("phone")}
                  />
                </div>
                <FormField label="Email" type="email" value={form.email} onChange={updateField("email")} />
              </section>

              <section className="space-y-6">
                <h2 className="font-display text-h3">Delivery Address</h2>
                <FormField
                  as="textarea"
                  label="Street Address"
                  rows={3}
                  value={form.address}
                  onChange={updateField("address")}
                />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <FormField label="City" value={form.city} onChange={updateField("city")} />
                  <FormField label="Province" value={form.province} onChange={updateField("province")} />
                  <FormField label="Postal Code" value={form.postalCode} onChange={updateField("postalCode")} />
                </div>

                {zone ? (
                  <div className="border border-hairline bg-warm p-4 text-sm">
                    <p>
                      {zone.name}
                      {zone.courier ? ` · ${zone.courier}` : ""}
                    </p>
                    <p className="mt-1 text-muted">
                      {zone.requiresQuote
                        ? "Shipping quote required — our team will confirm the cost."
                        : shippingFee === 0
                          ? "Complimentary delivery applies."
                          : formatIDR(shippingFee ?? 0)}
                    </p>
                  </div>
                ) : null}

                <FormField
                  as="textarea"
                  label="Delivery Notes"
                  hint="Optional"
                  rows={2}
                  value={form.notes}
                  onChange={updateField("notes")}
                />
              </section>

              <section className="space-y-6">
                <h2 className="font-display text-h3">Payment Method</h2>
                <PaymentMethodPicker
                  value={form.paymentMethod}
                  onChange={(id) => setForm((prev) => ({...prev, paymentMethod: id}))}
                />
              </section>

              <div>
                <Button
                  variant="dark"
                  size="lg"
                  disabled={!canReview}
                  onClick={() => setStep("review")}
                >
                  Review Order →
                </Button>
                {!canReview ? (
                  <p className="mt-2 text-xs text-danger">
                    Please add: {missingFields.join(", ")}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="font-display text-h3">Review &amp; Pay</h2>

              <div className="space-y-1 text-sm text-muted">
                <p>{form.fullName}</p>
                <p>{form.phone}</p>
                <p>{form.email}</p>
                <p>
                  {[form.address, form.city, form.province, form.postalCode].filter(Boolean).join(", ")}
                </p>
              </div>

              <Button variant="dark" size="lg" className="w-full" onClick={handlePay} disabled={isPaying}>
                {isPaying ? "Processing…" : `Pay ${formatIDR(total)}`}
              </Button>

              <p className="flex items-center gap-2 text-xs text-muted">
                <Icon icon={ICONS.lock} className="size-3.5" />
                Payments are processed securely by Xendit.
              </p>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-xs uppercase tracking-label text-muted hover:text-ink"
              >
                ← Back to details
              </button>
            </div>
          )}
        </div>

        <div className="lg:w-100">
          <div className="lg:sticky lg:top-28">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              breakdown={
                step === "review"
                  ? {
                      shippingFee,
                      shippingZoneName: zone?.name,
                      requiresQuote: zone?.requiresQuote ?? false,
                      tax,
                      total,
                    }
                  : undefined
              }
            />
            {step === "details" && subtotal < FREE_DELIVERY_THRESHOLD ? (
              <p className="mt-3 text-xs text-muted">
                Spend {formatIDR(FREE_DELIVERY_THRESHOLD - subtotal)} more for complimentary delivery.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Container>
  );
}
