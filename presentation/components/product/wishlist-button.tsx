"use client";

import {useState} from "react";
import type {MouseEvent} from "react";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import {useWishlist} from "@/presentation/providers/wishlist-provider";

export type WishlistButtonProps = {
  sku: string;
  productName: string;
  className?: string;
};

/**
 * Tombol wishlist — komponen terpisah dari ProductCard (bagian 6.2 issue.md).
 *
 * Wishlist wajib login (D2 issue #38): tamu yang menekan tombol ini tidak
 * menyimpan apa pun, melainkan diarahkan ke drawer sign in oleh
 * `WishlistProvider`. Menyembunyikan tombol untuk tamu tetap tidak dilakukan
 * supaya ajakan sign in itu terlihat.
 */
export function WishlistButton({sku, productName, className}: WishlistButtonProps) {
  const {isSaved, toggle} = useWishlist();
  const [pulse, setPulse] = useState<"save" | "remove" | null>(null);
  const saved = isSaved(sku);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const outcome = toggle(sku);
    // Tamu diarahkan ke drawer sign in oleh provider — tidak ada perubahan
    // state wishlist, jadi jangan memutar animasi seolah-olah tersimpan.
    if (outcome === "signin-required") return;
    setPulse(outcome === "saved" ? "save" : "remove");
  }

  return (
    <button
      type="button"
      data-sku={sku}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      aria-pressed={saved}
      onClick={handleClick}
      className={cn(
        "flex size-8 items-center justify-center bg-cream/90 text-ink transition-colors duration-300 ease-brand",
        className
      )}
    >
      <span
        key={pulse ?? "idle"}
        className={cn(
          "inline-flex",
          pulse === "save" && "animate-wishlist-save",
          pulse === "remove" && "animate-wishlist-remove"
        )}
      >
        <Icon
          icon={saved ? ICONS.heart : ICONS.heartOutline}
          className={cn("size-4", saved && "text-accent")}
        />
      </span>
    </button>
  );
}
