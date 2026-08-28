import type {CollectionSummary} from "@/domain/entities/collection-summary";
import {collectionSummariesSchema} from "@/infrastructure/api/schemas/collection";

/** `null` dari API → `undefined` di entity, supaya prop opsional React rapi. */
export function toCollectionSummaries(raw: unknown): CollectionSummary[] {
  return collectionSummariesSchema
    .parse(raw)
    .filter((row) => row !== null)
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      coverImage: row.coverImage ?? undefined,
      heroImage: row.heroImage ?? undefined,
      totalProducts: row.totalProducts,
      hasSoldOutProduct: row.hasSoldOutProduct,
    }));
}
