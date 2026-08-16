"use client";

import {useState} from "react";
import type {MouseEvent} from "react";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";
import {useAuth} from "@/presentation/providers/auth-provider";
import {useWishlist} from "@/presentation/providers/wishlist-provider";

export type WishlistButtonProps = {
  productId: string;
  productName: string;
  className?: string;
};

/**
 * Tombol wishlist — komponen terpisah dari ProductCard (bagian 6.2 issue.md).
 * Hook selalu dipanggil di urutan yang sama baik user login maupun tidak;
 * baru setelah itu komponen boleh merender `null` kalau belum login.
 */
export function WishlistButton({productId, productName, className}: WishlistButtonProps) {
  const {user} = useAuth();
  const {isSaved, toggle} = useWishlist();
  const [pulse, setPulse] = useState<"save" | "remove" | null>(null);
  const saved = isSaved(productId);

  if (!user) return null;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const outcome = toggle(productId);
    setPulse(outcome === "saved" ? "save" : "remove");
  }

  return (
    <button
      type="button"
      data-product-id={productId}
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
