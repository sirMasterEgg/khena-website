import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {formatIDR} from "@/presentation/lib/format";
import type {CartItem} from "@/presentation/providers/cart-provider";

/** Estimasi ongkir dari `POST /api/checkout/shipping-cost` — contract.md Bagian 39. */
export type ShippingEstimate =
  | {status: "loading"}
  | {status: "error"}
  | {status: "ready"; cost: number};

export type OrderSummaryBreakdown = {
  /** `null` kalau belum ada promo aktif untuk isi cart saat ini. */
  promo: {code: string; discountAmount: number; freeShipping: boolean} | null;
  shipping: ShippingEstimate;
  /** Subtotal − promo (+ ongkir kalau sudah diketahui dan bukan free_shipping). */
  estimatedTotal: number;
};

export type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  /** Diisi hanya di step 2 — Review & Pay. */
  breakdown?: OrderSummaryBreakdown;
};

/** Ringkasan pesanan checkout — contract.md Bagian 38-39, issue #43/#44. */
export function OrderSummary({items, subtotal, breakdown}: OrderSummaryProps) {
  return (
    <div className="border border-hairline p-6">
      <h2 className="font-display text-lg">Order Summary</h2>

      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.variantSku} className="flex gap-3">
            <div className="relative size-16 shrink-0 overflow-hidden">
              <RemoteImage src={item.image} alt={item.name} label={item.name} sizes="64px" />
            </div>
            <div className="flex-1 text-sm">
              <p>{item.name}</p>
              {item.colorName ? <p className="text-xs text-muted">{item.colorName}</p> : null}
              <p className="text-xs text-muted">Qty {item.qty}</p>
            </div>
            <p className="shrink-0 text-sm">{formatIDR(item.priceAfterDiscount * item.qty)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-2 border-t border-hairline pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatIDR(subtotal)}</span>
        </div>

        {breakdown ? (
          <>
            {breakdown.promo && breakdown.promo.discountAmount > 0 ? (
              <div className="flex justify-between">
                <span>Promo ({breakdown.promo.code})</span>
                <span>−{formatIDR(breakdown.promo.discountAmount)}</span>
              </div>
            ) : null}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shippingLabel(breakdown)}</span>
            </div>
            <div className="flex justify-between border-t border-ink pt-2 text-base">
              <span>Total</span>
              <span>{formatIDR(breakdown.estimatedTotal)}</span>
            </div>
            {!breakdown.promo?.freeShipping && breakdown.shipping.status !== "ready" ? (
              <p className="text-xs text-muted">Shipping will be added on the payment page.</p>
            ) : null}
          </>
        ) : (
          <p className="text-xs text-muted">Full breakdown on the next step.</p>
        )}
      </div>
    </div>
  );
}

function shippingLabel(breakdown: OrderSummaryBreakdown): string {
  if (breakdown.promo?.freeShipping) return "Free shipping (promo)";
  if (breakdown.shipping.status === "loading") return "Calculating…";
  if (breakdown.shipping.status === "error") return "Unavailable";
  return formatIDR(breakdown.shipping.cost);
}
