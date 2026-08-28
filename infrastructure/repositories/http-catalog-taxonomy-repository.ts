import type {CatalogTaxonomyRepository} from "@/domain/repositories/catalog-taxonomy-repository";
import type {CatalogCategory, CatalogCollection} from "@/domain/entities/catalog";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {toCatalogCategories, toCatalogCollections} from "@/infrastructure/api/mappers/catalog";

/** Paginasi `/api/categories` per room type, bukan per kategori — ambil semua sekaligus. */
const LIST_LIMIT = 50;
const REVALIDATE_SECONDS = 300;

/** Kategori & koleksi untuk filter bar `/shop` — terpisah dari repository navbar (D6, issue #32). */
export class HttpCatalogTaxonomyRepository implements CatalogTaxonomyRepository {
  async getCategories(): Promise<CatalogCategory[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.categories.list, {
        query: {page: 1, limit: LIST_LIMIT},
        revalidateSeconds: REVALIDATE_SECONDS,
        tags: ["categories"],
      });
      return toCatalogCategories(raw);
    } catch (error) {
      console.error("[shop] gagal memuat kategori, chip filter dikosongkan", error);
      return [];
    }
  }

  async getCollections(): Promise<CatalogCollection[]> {
    try {
      const raw = await serverFetch<unknown>(API_ENDPOINTS.collections.list, {
        query: {page: 1, limit: LIST_LIMIT},
        revalidateSeconds: REVALIDATE_SECONDS,
        tags: ["collections"],
      });
      return toCatalogCollections(raw);
    } catch (error) {
      console.error("[shop] gagal memuat koleksi", error);
      return [];
    }
  }
}
