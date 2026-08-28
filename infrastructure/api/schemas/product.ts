import {z} from "zod";

/**
 * Schema detail produk publik (`GET /api/products/:id`, contract.md bagian
 * 33) — hanya field yang dipakai `FeaturedProduct` (Fase 6 issue #27).
 */
export const productVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  image: z.string().nullable().optional(),
  stock: z.number(),
});

export const productDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  media: z.array(z.string()).optional().default([]),
  variants: z.array(productVariantSchema).optional().default([]),
});

export type ProductDetail = z.infer<typeof productDetailSchema>;
