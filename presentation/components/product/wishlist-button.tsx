"use client";

import {useState} from "react";
import type {MouseEvent} from "react";
import {Icon} from "@/presentation/components/icon";
import {ICONS} from "@/presentation/components/icons";
import {cn} from "@/presentation/lib/cn";

// TODO(ISSUE-14): ganti dua baris ini dengan AuthProvider (login) dan
// WishlistProvider (status tersimpan sungguhan dari server).
const TEMP_IS_LOGGED_IN = true;

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
  const [isSaved, setIsSaved] = useState(false);
  const [pulse, setPulse] = useState<"save" | "remove" | null>(null);

  if (!TEMP_IS_LOGGED_IN) return null;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsSaved((prev) => {
      const next = !prev;
      setPulse(next ? "save" : "remove");
      return next;
    });
    // TODO(ISSUE-14): panggil WishlistProvider.toggle(productId) sungguhan.
  }

  return (
    <button
      type="button"
      data-product-id={productId}
      aria-label={isSaved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      aria-pressed={isSaved}
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
          icon={isSaved ? ICONS.heart : ICONS.heartOutline}
          className={cn("size-4", isSaved && "text-accent")}
        />
      </span>
    </button>
  );
}
