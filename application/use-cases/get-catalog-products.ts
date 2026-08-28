import type {
  ProductCatalogPage,
  ProductCatalogQuery,
} from "@/domain/repositories/product-catalog-repository";
import {productCatalogRepository} from "@/infrastructure/repositories";

/**
 * Katalog produk `/shop`, difilter/di-sort/dipaginasi lewat query param
 * backend — bukan di memori (D2, issue #32).
 *
 * Tidak memfilter `isLive()` di sini — endpoint publik sudah hanya mengirim
 * produk `published` dengan varian visible (contract.md Bagian 30).
 *
 * Sengaja melempar: yang menangkap kegagalan adalah halaman, supaya bisa
 * membedakan "katalog tidak tersedia" dari "filter tidak menghasilkan
 * apa-apa" (D9).
 */
export async function getCatalogProducts(query: ProductCatalogQuery): Promise<ProductCatalogPage> {
  return productCatalogRepository.list(query);
}
