import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {COLOR_SWATCHES} from "@/domain/entities/color-swatch";
import {formatIDR} from "@/presentation/lib/format";
import type {CartItem} from "@/presentation/providers/cart-provider";

export type OrderSummaryBreakdown = {
  shippingFee: number | null;
  shippingZoneName?: string;
  requiresQuote: boolean;
  tax: number;
  total: number;
};

export type OrderSummaryProps = {
  items: CartItem[];
  subtotal: number;
  /** Diisi hanya di step 2 — Review & Pay. */
  breakdown?: OrderSummaryBreakdown;
};

/** Ringkasan pesanan checkout — bagian 4.10 issue.md. */
export function OrderSummary({items, subtotal, breakdown}: OrderSummaryProps) {
  return (
    <div className="border border-hairline p-6">
      <h2 className="font-display text-lg">Order Summary</h2>

      <ul className="mt-4 space-y-4">
        {items.map((item) => {
          const colorSwatch = item.color ? COLOR_SWATCHES[item.color] : undefined;
          return (
            <li key={`${item.productId}::${item.color ?? ""}`} className="flex gap-3">
              <div className="size-16 shrink-0">
                <PlaceholderImage label={item.name} />
              </div>
              <div className="flex-1 text-sm">
                <p>{item.name}</p>
                {colorSwatch ? <p className="text-xs text-muted">{colorSwatch.label}</p> : null}
                <p className="text-xs text-muted">Qty {item.qty}</p>
              </div>
              <p className="shrink-0 text-sm">{formatIDR(item.price * item.qty)}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 space-y-2 border-t border-hairline pt-4 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatIDR(subtotal)}</span>
        </div>

        {breakdown ? (
          <>
            <div className="flex justify-between">
              <span>Shipping{breakdown.shippingZoneName ? ` (${breakdown.shippingZoneName})` : ""}</span>
              <span>
                {breakdown.requiresQuote
                  ? "Quote required"
                  : breakdown.shippingFee === 0
                    ? "Complimentary"
                    : formatIDR(breakdown.shippingFee ?? 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Tax (11%)</span>
              <span>{formatIDR(breakdown.tax)}</span>
            </div>
            <div className="flex justify-between border-t border-ink pt-2 text-base">
              <span>Total</span>
              <span>
                {formatIDR(breakdown.total)}
                {breakdown.requiresQuote ? "*" : ""}
              </span>
            </div>
            {breakdown.requiresQuote ? (
              <p className="text-xs text-muted">
                * Final shipping cost will be confirmed by our team for this destination.
              </p>
            ) : null}
          </>
        ) : (
          <p className="text-xs text-muted">Full breakdown on the next step.</p>
        )}
      </div>
    </div>
  );
}
