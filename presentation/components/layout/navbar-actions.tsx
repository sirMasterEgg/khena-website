"use client";

import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {useUi} from "@/presentation/providers/ui-provider";
import {useCart} from "@/presentation/providers/cart-provider";

/** Ikon Search, Account, Cart, dan Hamburger di kanan navbar — bagian 3.1 issue.md. */
export function NavbarActions() {
  const {open, toggle, isOpen} = useUi();
  const {itemCount, isHydrated} = useCart();
  // Badge hanya dirender setelah cart selesai dibaca dari localStorage,
  // supaya tidak terjadi hydration mismatch — bagian 2.7 issue.md.
  const cartItemCount = isHydrated ? itemCount : 0;

  return (
    <div className="flex items-center justify-end gap-5">
      <button type="button" aria-label="Search" onClick={() => open("search")}>
        <Icon icon={ICONS.search} className="size-4.5" />
      </button>
      <button type="button" aria-label="Account" onClick={() => open("account")}>
        <Icon icon={ICONS.user} className="size-4.5" />
      </button>
      <button
        type="button"
        aria-label={`Cart, ${cartItemCount} item`}
        className="relative"
        onClick={() => open("cart")}
      >
        <Icon icon={ICONS.cart} className="size-4.5" />
        {cartItemCount > 0 ? (
          <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-ink text-xs text-cream">
            {cartItemCount}
          </span>
        ) : null}
      </button>
      <button
        type="button"
        aria-label={isOpen("mobileMenu") ? "Close menu" : "Open menu"}
        className="lg:hidden"
        onClick={() => toggle("mobileMenu")}
      >
        <Icon icon={isOpen("mobileMenu") ? ICONS.close : ICONS.menu} className="size-5" />
      </button>
    </div>
  );
}
