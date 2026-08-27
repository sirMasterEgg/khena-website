import type {ProductSummary} from "@/domain/entities/product-summary";
import {productSummariesSchema} from "@/infrastructure/api/schemas/product-summary";

export function toProductSummaries(raw: unknown): ProductSummary[] {
  return productSummariesSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({
      id: row.id,
      name: row.name,
      sku: row.sku,
      image: row.image ?? undefined,
      price: row.price,
      discountPercent: row.discountPercent,
      priceAfterDiscount: row.priceAfterDiscount,
      stock: row.stock,
    }));
}
