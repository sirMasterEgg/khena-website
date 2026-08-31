import {z} from "zod";

/**
 * `productSummary` — contract.md Bagian 30 (dipakai `GET /api/products`,
 * dsb). `.nullable().catch(null)` per item: satu baris yang bentuknya rusak
 * jadi `null` lalu dibuang di mapper, sisanya tetap tampil. `.catch([])` di
 * level array adalah jaring terakhir kalau `data` ternyata bukan array.
 */
export const productSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  image: z.string().nullable().catch(null),
  price: z.number(),
  discountPercent: z.number(),
  priceAfterDiscount: z.number(),
  stock: z.number(),
});

export const productSummariesSchema = z
  .array(productSummarySchema.nullable().catch(null))
  .catch([]);
