import type {CollectionSummary} from "@/domain/entities/collection-summary";
import type {PageMeta} from "@/domain/entities/pagination";

export type CollectionCatalogQuery = {
  page?: number;
  limit?: number;
};

export type CollectionCatalogPage = {items: CollectionSummary[]; meta: PageMeta};

/** Daftar koleksi published untuk halaman `/collections` — contract.md Bagian 34. */
export interface CollectionCatalogRepository {
  list(query: CollectionCatalogQuery): Promise<CollectionCatalogPage>;
}
