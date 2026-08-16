"use client";

import {useMemo} from "react";
import {useWishlist} from "@/presentation/providers/wishlist-provider";
import {MOCK_PRODUCTS} from "@/infrastructure/mock/data/products";

/**
 * Produk yang tersimpan di wishlist pengguna saat ini. Mengambil langsung
 * dari data mock (client-safe, sinkron) — diganti dengan query API begitu
 * ISSUE-15 selesai.
 */
export function useSavedProducts() {
  const {productIds} = useWishlist();
  return useMemo(
    () => MOCK_PRODUCTS.filter((product) => productIds.includes(product.id)),
    [productIds]
  );
}
