import type {ProductDetail, ProductDimensionSet} from "@/domain/entities/product-detail";
import {productDetailSchema} from "@/infrastructure/api/schemas/product-detail";

type RawDimensionSet = {
  width: number | null;
  depth: number | null;
  height: number | null;
  weight: number | null;
  image: string | null;
} | null;

function toDimensionSet(raw: RawDimensionSet): ProductDimensionSet | undefined {
  if (!raw) return undefined;
  const set: ProductDimensionSet = {
    width: raw.width ?? undefined,
    depth: raw.depth ?? undefined,
    height: raw.height ?? undefined,
    weight: raw.weight ?? undefined,
    image: raw.image ?? undefined,
  };
  // Objek yang semua fieldnya kosong sama saja dengan tidak ada.
  return Object.values(set).some((value) => value !== undefined) ? set : undefined;
}

export function toProductDetail(raw: unknown): ProductDetail {
  const row = productDetailSchema.parse(raw);

  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    description: row.description ?? undefined,
    materials: row.materialAndCare?.materials ?? undefined,
    careInstructions: row.materialAndCare?.careInstructions ?? [],
    dimensions: {
      product: toDimensionSet(row.dimensions?.product ?? null),
      box: toDimensionSet(row.dimensions?.box ?? null),
    },
    media: row.media,
    variants: row.variants
      .filter((variant) => variant !== null)
      .map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        images: variant.images,
        colorName: variant.color?.name ?? undefined,
        colorHex: variant.color?.hexCode ?? undefined,
        price: variant.price,
        discountPercent: variant.discountPercent,
        priceAfterDiscount: variant.priceAfterDiscount,
        stock: variant.stock,
      })),
  };
}
