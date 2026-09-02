import {z} from "zod";

/**
 * Response `GET /api/products/:sku` — contract.md Bagian 33. Gaya defensif
 * sama seperti `product-summary.ts` (D13): hanya `id`/`name`/`sku` yang wajib,
 * sisanya `.catch(...)` supaya satu field rusak tidak mematikan PDP.
 */
const nullableText = z.string().nullable().catch(null);
const nullableNumber = z.number().nullable().catch(null);

const colorSchema = z
  .object({name: nullableText, hexCode: nullableText, swatch: nullableText})
  .nullable()
  .catch(null);

const dimensionSetSchema = z
  .object({
    width: nullableNumber,
    depth: nullableNumber,
    height: nullableNumber,
    weight: nullableNumber,
    image: nullableText,
  })
  .nullable()
  .catch(null);

export const productDetailVariantSchema = z.object({
  id: z.string(),
  sku: z.string(),
  // Backend commit 3cad33a: `image` tunggal diganti `images` array (bisa []).
  images: z.array(z.string()).catch([]),
  color: colorSchema,
  price: z.number().catch(0),
  discountPercent: z.number().catch(0),
  priceAfterDiscount: z.number().catch(0),
  stock: z.number().catch(0),
});

export const productDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  description: nullableText,
  materialAndCare: z
    .object({
      materials: nullableText,
      careInstructions: z.array(z.string()).catch([]),
    })
    .nullable()
    .catch(null),
  dimensions: z
    .object({product: dimensionSetSchema, box: dimensionSetSchema})
    .nullable()
    .catch(null),
  media: z.array(z.string()).catch([]),
  // Satu varian rusak dibuang di mapper, sisanya tetap tampil.
  variants: z.array(productDetailVariantSchema.nullable().catch(null)).catch([]),
});
