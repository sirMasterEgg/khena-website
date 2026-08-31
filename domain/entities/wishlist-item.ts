import type {ProductSummary} from "@/domain/entities/product-summary";

/**
 * Satu baris wishlist milik user — contract.md Bagian 35. `id` adalah id baris
 * wishlist (bukan id produk); yang dipakai untuk menambah/menghapus adalah
 * `product.sku` (`products.base_sku`).
 */
export type WishlistItem = {
  id: string;
  product: ProductSummary;
};
