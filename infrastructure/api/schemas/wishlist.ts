import {z} from "zod";
import {productSummarySchema} from "@/infrastructure/api/schemas/product-summary";

/**
 * Baris `GET /api/wishlists` — contract.md Bagian 35. Pola defensif sama dengan
 * product-summary.ts: satu baris rusak jadi `null` lalu dibuang di mapper,
 * sisanya tetap tampil.
 */
const wishlistItemSchema = z.object({
  id: z.string(),
  product: productSummarySchema,
});

export const wishlistItemsSchema = z
  .array(wishlistItemSchema.nullable().catch(null))
  .catch([]);
