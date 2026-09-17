import type {ProductDetail} from "@/domain/entities/product-detail";
import {ApiRequestError} from "@/infrastructure/api/api-error";
import {productDetailRepository} from "@/infrastructure/repositories";

/**
 * Detail produk untuk PDP. `null` HANYA untuk produk yang memang tidak ada /
 * tidak published — backend mengirimnya sebagai 400 + `code: "NOT_FOUND"`
 * (contract.md Bagian 1; memang bukan 404 di proyek ini — D3). Error lain
 * sengaja dilempar supaya jatuh ke error boundary, bukan menyamar jadi 404.
 */
export async function getProductDetail(sku: string): Promise<ProductDetail | null> {
  try {
    return await productDetailRepository.getBySku(sku);
  } catch (error) {
    if (error instanceof ApiRequestError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}
