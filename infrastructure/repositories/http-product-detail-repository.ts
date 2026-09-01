import type {ProductDetail} from "@/domain/entities/product-detail";
import type {ProductSummary} from "@/domain/entities/product-summary";
import type {ProductDetailRepository} from "@/domain/repositories/product-detail-repository";
import {API_ENDPOINTS} from "@/infrastructure/api/endpoints";
import {serverFetch} from "@/infrastructure/api/server-fetch";
import {toProductDetail} from "@/infrastructure/api/mappers/product-detail";
import {toProductSummaries} from "@/infrastructure/api/mappers/product-summary";

/** Harga & stok berubah lebih sering daripada konten CMS (default serverFetch 300 detik). */
const REVALIDATE_SECONDS = 60;

/** PDP `/product/[sku]` — contract.md Bagian 33. */
export class HttpProductDetailRepository implements ProductDetailRepository {
  async getBySku(sku: string): Promise<ProductDetail> {
    const raw = await serverFetch<unknown>(API_ENDPOINTS.products.detail(sku), {
      revalidateSeconds: REVALIDATE_SECONDS,
      tags: ["products:detail", `products:detail:${sku}`],
    });
    return toProductDetail(raw);
  }

  async getRelatedBySku(sku: string): Promise<ProductSummary[]> {
    const raw = await serverFetch<unknown>(API_ENDPOINTS.products.related(sku), {
      revalidateSeconds: REVALIDATE_SECONDS,
      tags: ["products", `products:related:${sku}`],
    });
    return toProductSummaries(raw);
  }
}
