import type {WishlistItem} from "@/domain/entities/wishlist-item";
import {wishlistItemsSchema} from "@/infrastructure/api/schemas/wishlist";

export function toWishlistItems(raw: unknown): WishlistItem[] {
  return wishlistItemsSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({
      id: row.id,
      product: {
        id: row.product.id,
        name: row.product.name,
        sku: row.product.sku,
        // `null` dari API -> `undefined` di entity, sama seperti mapper lain.
        image: row.product.image ?? undefined,
        price: row.product.price,
        discountPercent: row.product.discountPercent,
        priceAfterDiscount: row.product.priceAfterDiscount,
        stock: row.product.stock,
      },
    }));
}
