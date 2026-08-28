import type {CatalogCategory, CatalogCollection} from "@/domain/entities/catalog";
import {catalogTaxonomyRepository} from "@/infrastructure/repositories";

export type ShopFilters = {categories: CatalogCategory[]; collections: CatalogCollection[]};

/**
 * Daftar kategori & koleksi untuk filter bar `/shop`. Tidak pernah melempar:
 * filter bar kosong lebih baik daripada `/shop` mati (D9, issue #32) —
 * `HttpCatalogTaxonomyRepository` sendiri sudah membungkus tiap sumber data
 * dengan try/catch, jadi di sini cukup `Promise.all`.
 */
export async function getShopFilters(): Promise<ShopFilters> {
  const [categories, collections] = await Promise.all([
    catalogTaxonomyRepository.getCategories(),
    catalogTaxonomyRepository.getCollections(),
  ]);
  return {categories, collections};
}
