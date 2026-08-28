import type {CatalogCategory, CatalogCollection} from "@/domain/entities/catalog";

/**
 * Daftar kategori & koleksi untuk filter bar `/shop` — terpisah dari
 * `CategoryRepository`/`CollectionRepository` lama karena entity di sana
 * membawa field (`room`, `blurb`, `status`) yang tidak ada di API publik (D6,
 * issue #32).
 */
export interface CatalogTaxonomyRepository {
  getCategories(): Promise<CatalogCategory[]>;
  getCollections(): Promise<CatalogCollection[]>;
}
