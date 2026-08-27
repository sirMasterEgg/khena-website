import type {ProductSearchRepository} from "@/domain/repositories/product-search-repository";
import type {ProductSummary} from "@/domain/entities/product-summary";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {apiClient} from "@/infrastructure/api/client";
import {toProductSummaries} from "@/infrastructure/api/mappers/product-summary";

/** Hasil ditampilkan di overlay pencarian, bukan halaman katalog — cukup segenggam. */
const RESULT_LIMIT = 6;

/**
 * Beda dari repository lain di folder ini (`Http*` untuk navbar, landing,
 * dsb): itu semua dipanggil dari Server Component lewat `serverFetch`
 * (konten yang bisa di-cache/`revalidate`). Pencarian-saat-mengetik murni
 * interaksi browser — tidak ada render server untuk dihidrasi, jadi transport-
 * nya `apiClient` (axios), sama seperti endpoint bersesi lain. Dipanggil
 * langsung dari komponen `"use client"` (`SearchOverlay`), bukan lewat
 * Server Component + props seperti data navbar.
 */
export class HttpProductSearchRepository implements ProductSearchRepository {
  async search(query: string, signal?: AbortSignal): Promise<ProductSummary[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const res = await apiClient.get(API_ENDPOINTS.products.list, {
      params: {search: trimmed, limit: RESULT_LIMIT},
      signal,
    });
    return toProductSummaries(res.data.data);
  }
}
