import type {ProductSummary} from "@/domain/entities/product-summary";

export interface ProductSearchRepository {
  /**
   * `signal` opsional: dipakai pemanggil client (mis. TanStack Query) untuk
   * membatalkan request yang sudah usang saat user mengetik lebih cepat dari
   * jawaban server.
   */
  search(query: string, signal?: AbortSignal): Promise<ProductSummary[]>;
}
