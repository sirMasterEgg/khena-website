import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductCatalogRepository,
} from "@/domain/repositories/product-catalog-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetchList} from "@/infrastructure/api/server-fetch";
import {toProductSummaries} from "@/infrastructure/api/mappers/product-summary";
import {toPageMeta} from "@/infrastructure/api/mappers/catalog";

/** Grid /shop 3 kolom — 12 kartu = 4 baris penuh. Sama dengan default backend. */
const DEFAULT_LIMIT = 12;
/** Katalog lebih sering berubah daripada konten CMS (default serverFetch 300 detik). */
const REVALIDATE_SECONDS = 60;

/** Katalog produk `/shop` — contract.md Bagian 33, issue #32. */
export class HttpProductCatalogRepository implements ProductCatalogRepository {
  async list(query: ProductCatalogQuery): Promise<ProductCatalogPage> {
    const {data, meta} = await serverFetchList(API_ENDPOINTS.products.list, {
      query: {
        search: query.search,
        category: query.category,
        collection: query.collection,
        sort: query.sort,
        orderDir: query.orderDir,
        page: query.page ?? 1,
        limit: query.limit ?? DEFAULT_LIMIT,
      },
      revalidateSeconds: REVALIDATE_SECONDS,
      tags: ["products"],
    });
    return {items: toProductSummaries(data), meta: toPageMeta(meta)};
  }
}
