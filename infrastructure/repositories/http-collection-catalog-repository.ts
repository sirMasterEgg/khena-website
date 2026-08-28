import type {
  CollectionCatalogPage,
  CollectionCatalogQuery,
  CollectionCatalogRepository,
} from "@/domain/repositories/collection-catalog-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetchList} from "@/infrastructure/api/server-fetch";
import {toCollectionSummaries} from "@/infrastructure/api/mappers/collection";
import {toPageMeta} from "@/infrastructure/api/mappers/catalog";

/**
 * Limit sengaja besar (D4): dengan 48 per halaman hampir semua koleksi muat di
 * satu halaman sehingga tampilannya tetap seperti desain, tapi paginasi
 * Prev/Next tetap ada supaya koleksi ke-49 dan seterusnya tidak hilang.
 */
const DEFAULT_LIMIT = 48;

/** `totalProducts` & `hasSoldOutProduct` ikut berubah saat stok berubah (D9). */
const REVALIDATE_SECONDS = 60;

/** Koleksi publik `/collections` — contract.md Bagian 34. */
export class HttpCollectionCatalogRepository implements CollectionCatalogRepository {
  async list(query: CollectionCatalogQuery): Promise<CollectionCatalogPage> {
    const {data, meta} = await serverFetchList(API_ENDPOINTS.collections.list, {
      query: {
        page: query.page ?? 1,
        limit: query.limit ?? DEFAULT_LIMIT,
      },
      revalidateSeconds: REVALIDATE_SECONDS,
      tags: ["collections"],
    });
    return {items: toCollectionSummaries(data), meta: toPageMeta(meta)};
  }
}
