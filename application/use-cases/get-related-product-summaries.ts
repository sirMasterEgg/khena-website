import type {ProductSummary} from "@/domain/entities/product-summary";
import {productDetailRepository} from "@/infrastructure/repositories";

/** Related Pieces bukan konten kritis — gagal memuat cukup menyembunyikan section (D8). */
export async function getRelatedProductSummaries(sku: string): Promise<ProductSummary[]> {
  try {
    return await productDetailRepository.getRelatedBySku(sku);
  } catch (error) {
    console.error(`[product-detail] gagal memuat related untuk ${sku}`, error);
    return [];
  }
}
