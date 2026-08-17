"use client";

import Link from "next/link";
import {Drawer} from "@/presentation/components/ui/drawer";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";
import {Button} from "@/presentation/components/ui/button";
import {TextLink} from "@/presentation/components/ui/text-link";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {COLOR_SWATCHES} from "@/domain/entities/color-swatch";
import {formatIDR} from "@/presentation/lib/format";
import {FREE_DELIVERY_THRESHOLD} from "@/presentation/lib/constants";
import {useCart} from "@/presentation/providers/cart-provider";
import {useUi} from "@/presentation/providers/ui-provider";

/** Cart drawer — bagian 3.3 issue.md. */
export function CartDrawer() {
  const {isOpen, close} = useUi();
  const open = isOpen("cart");
  const {items, itemCount, subtotal, updateQty, removeItem} = useCart();

  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);

  return (
    <Drawer open={open} onClose={close} ariaLabel="Your Bag">
      <div className="flex items-center justify-between border-b border-ink p-6">
        <h2 className="font-display text-xl">Your Bag ({itemCount})</h2>
        <button type="button" aria-label="Close cart" onClick={close}>
          <Icon icon={ICONS.close} className="size-5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
          <Icon icon={ICONS.cart} className="size-10 text-faint" />
          <p className="font-display text-xl">Your bag is quiet for now.</p>
          <p className="text-sm text-muted">
            Pieces you add will appear here, ready whenever you are.
          </p>
          <TextLink href="/collections" onClick={close}>
            EXPLORE THE COLLECTION
          </TextLink>
        </div>
      ) : (
        <>
          <div className="border-b border-hairline p-6">
            {remaining > 0 ? (
              <p className="text-xs text-muted">
                You&apos;re {formatIDR(remaining)} away from complimentary delivery
              </p>
            ) : (
              <p className="text-xs text-ink">
                ✓ You&apos;ve unlocked complimentary white-glove delivery
              </p>
            )}
            <div className="mt-2 h-1 w-full bg-hairline">
              <div
                className="h-1 bg-ink transition-[width] duration-500 ease-brand"
                style={{width: `${progress}%`}}
              />
            </div>
          </div>

          <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-6">
            {items.map((item) => {
              const colorSwatch = item.color ? COLOR_SWATCHES[item.color] : undefined;
              const itemTotal = item.price * item.qty;
              const compareTotal = item.comparePrice ? item.comparePrice * item.qty : undefined;

              return (
                <li key={`${item.productId}::${item.color ?? ""}`} className="flex gap-4 py-6">
                  <Link href={`/product/${item.productId}`} onClick={close} className="size-20 shrink-0">
                    <PlaceholderImage label={item.name} />
                  </Link>

                  <div className="flex flex-1 flex-col gap-1">
                    <Link href={`/product/${item.productId}`} onClick={close} className="text-sm">
                      {item.name}
                    </Link>

                    {colorSwatch ? (
                      <p className="flex items-center gap-2 text-xs text-muted">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{backgroundColor: colorSwatch.chipColor}}
                          aria-hidden="true"
                        />
                        {colorSwatch.label}
                      </p>
                    ) : null}

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-ink">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="px-3 py-1"
                          onClick={() => updateQty(item.productId, item.color, item.qty - 1)}
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs">{item.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.name}`}
                          className="px-3 py-1"
                          onClick={() => updateQty(item.productId, item.color, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right text-sm">
                        {compareTotal && compareTotal > itemTotal ? (
                          <p className="text-xs text-muted line-through">{formatIDR(compareTotal)}</p>
                        ) : null}
                        <p>{formatIDR(itemTotal)}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-1 self-start text-xs uppercase tracking-label text-muted hover:text-ink"
                      onClick={() => removeItem(item.productId, item.color)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="space-y-3 border-t border-ink p-6">
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <Button href="/checkout" variant="dark" size="lg" className="w-full" onClick={close}>
              Proceed to Checkout
            </Button>
            <button
              type="button"
              onClick={close}
              className="w-full text-center text-xs uppercase tracking-label text-muted hover:text-ink"
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}
