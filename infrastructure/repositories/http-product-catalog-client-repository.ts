import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductCatalogRepository,
} from "@/domain/repositories/product-catalog-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";
import {toProductSummaries} from "@/infrastructure/api/mappers/product-summary";
import {toPageMeta} from "@/infrastructure/api/mappers/catalog";

const DEFAULT_LIMIT = 12;

/**
 * Sama seperti `HttpProductCatalogRepository`, tapi transport `apiClient`
 * (axios) alih-alih `serverFetch` — supaya aman diimpor dari komponen
 * `"use client"`. Dipakai infinite scroll `/shop` (`ShopProductGrid`) untuk
 * mengambil halaman ke-2 dst. tanpa menarik `serverFetch.ts` yang
 * `import "server-only"` ke bundle browser. Diekspor lewat
 * `infrastructure/repositories/client.ts`, bukan `index.ts`.
 */
export class HttpProductCatalogClientRepository implements ProductCatalogRepository {
  async list(query: ProductCatalogQuery): Promise<ProductCatalogPage> {
    const res = await apiClient.get(API_ENDPOINTS.products.list, {
      params: {
        search: query.search,
        category: query.category,
        collection: query.collection,
        sort: query.sort,
        orderDir: query.orderDir,
        page: query.page ?? 1,
        limit: query.limit ?? DEFAULT_LIMIT,
      },
    });
    return {items: toProductSummaries(res.data.data), meta: toPageMeta(res.data.meta)};
  }
}
