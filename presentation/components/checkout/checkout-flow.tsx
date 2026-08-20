"use client";

import {useState} from "react";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
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
import {PaymentMethodPicker} from "@/presentation/components/checkout/payment-method-picker";
import {WhatsAppPaymentGateway} from "@/infrastructure/payment/whatsapp-payment-gateway";
import {useCart} from "@/presentation/providers/cart-provider";
import {useUi} from "@/presentation/providers/ui-provider";

type Step = "details" | "review";

// Field yang divalidasi sebelum boleh lanjut dari step "details" ke "review".
const DETAILS_FIELDS = ["fullName", "phone", "email", "address", "city"] as const;

const checkoutSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(1, "Phone number is required"),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
  address: z.string().trim().min(1, "Street address is required"),
  city: z.string().trim().min(1, "City is required"),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["virtual-account", "e-wallet", "credit-card"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

/** Alur checkout dua langkah — bagian 4.10 issue.md. */
export function CheckoutFlow() {
  const {items, subtotal, isHydrated} = useCart();
  const {open: openOverlay} = useUi();
  const [step, setStep] = useState<Step>("details");
  const [isPaying, setIsPaying] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: {errors},
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      notes: "",
      paymentMethod: "virtual-account",
    },
  });

  // `useWatch` (bukan `form.watch()`) supaya kompatibel dengan React
  // Compiler — `watch()` mengembalikan fungsi yang tidak bisa di-memoize.
  const values = useWatch({control});
  const city = values.city ?? "";

  const zone = city.trim() ? detectShippingZone(city) : undefined;
  const shippingFee = !zone
    ? null
    : zone.requiresQuote
      ? null
      : zone.freeThreshold !== null && subtotal >= zone.freeThreshold
        ? 0
        : zone.fee;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + (shippingFee ?? 0) + tax;

  // "Review Order" cuma memvalidasi field step "details" — paymentMethod
  // sudah selalu punya default, jadi tidak perlu ikut di-trigger di sini.
  async function handleContinueToReview() {
    const valid = await trigger(DETAILS_FIELDS);
    if (valid) setStep("review");
  }

  async function handlePay(formValues: CheckoutFormValues) {
    setIsPaying(true);
    const gateway = new WhatsAppPaymentGateway();
    const result = await gateway.createOrder({
      customerName: formValues.fullName,
      customerPhone: formValues.phone,
      customerEmail: formValues.email,
      shippingAddress: [formValues.address, formValues.city, formValues.province, formValues.postalCode]
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
    <Container as="form" onSubmit={handleSubmit(handlePay)} noValidate className="py-10">
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

      {/* Banner "Save this to your account" untuk tamu dihapus di ISSUE-17:
          halaman /checkout sekarang dibungkus <RequireAuth>, jadi
          CheckoutFlow tidak pernah dirender untuk tamu lagi. */}

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        {/* Order Summary tampil duluan di mobile (di atas form) supaya
            pembeli langsung lihat isi pesanannya sebelum mengisi detail —
            `lg:order-2` mengembalikannya ke kolom kanan di desktop. */}
        <div className="min-w-0 order-1 lg:order-2">
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

        <div className="order-2 min-w-0 lg:order-1 lg:max-w-175">
          {/* Kedua step tetap dirender di dalam `<form>` yang sama supaya
              nilainya (RHF) tidak hilang saat pindah step — cuma disembunyikan
              lewat `hidden`, bukan di-unmount. */}
          <div className={step === "details" ? "space-y-10" : "hidden"}>
            <section className="space-y-6">
              <h2 className="font-display text-h3">Contact</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField label="Full Name" {...register("fullName")} error={errors.fullName?.message} />
                <FormField
                  label="Phone (WhatsApp)"
                  type="tel"
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>
              <FormField label="Email" type="email" {...register("email")} error={errors.email?.message} />
            </section>

            <section className="space-y-6">
              <h2 className="font-display text-h3">Delivery Address</h2>
              <FormField
                as="textarea"
                label="Street Address"
                rows={3}
                {...register("address")}
                error={errors.address?.message}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField label="City" {...register("city")} error={errors.city?.message} />
                <FormField label="Province" {...register("province")} />
                <FormField label="Postal Code" {...register("postalCode")} />
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
                {...register("notes")}
              />
            </section>

            <section className="space-y-6">
              <h2 className="font-display text-h3">Payment Method</h2>
              <Controller
                control={control}
                name="paymentMethod"
                render={({field}) => <PaymentMethodPicker value={field.value} onChange={field.onChange} />}
              />
            </section>

            <div>
              <Button variant="dark" size="lg" type="button" onClick={handleContinueToReview}>
                Review Order →
              </Button>
            </div>
          </div>

          <div className={step === "review" ? "space-y-6" : "hidden"}>
            <h2 className="font-display text-h3">Review &amp; Pay</h2>

            <div className="space-y-1 text-sm text-muted">
              <p>{values.fullName}</p>
              <p>{values.phone}</p>
              <p>{values.email}</p>
              <p>{[values.address, values.city, values.province, values.postalCode].filter(Boolean).join(", ")}</p>
            </div>

            <Button type="submit" variant="dark" size="lg" className="w-full" disabled={isPaying}>
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
        </div>
      </div>
    </Container>
  );
}
