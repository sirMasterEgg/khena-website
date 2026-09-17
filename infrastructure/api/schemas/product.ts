import {z} from "zod";

/**
 * Schema detail produk publik (`GET /api/products/:id`, contract.md bagian
 * 33) — hanya field yang dipakai `FeaturedProduct` (Fase 6 issue #27).
 * Rename dari `productVariantSchema`/`productDetailSchema` (issue #40) supaya
 * tidak bentrok nama dengan skema detail penuh di `product-detail.ts`.
 */
export const featuredProductVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  image: z.string().nullable().optional(),
  stock: z.number(),
});

export const featuredProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  media: z.array(z.string()).optional().default([]),
  variants: z.array(featuredProductVariantSchema).optional().default([]),
});

export type FeaturedProductResponse = z.infer<typeof featuredProductSchema>;
