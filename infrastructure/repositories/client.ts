import type {ProductSearchRepository} from "@/domain/repositories/product-search-repository";
import type {ProductCatalogRepository} from "@/domain/repositories/product-catalog-repository";
import {HttpProductSearchRepository} from "@/infrastructure/repositories/http-product-search-repository";
import {HttpProductCatalogClientRepository} from "@/infrastructure/repositories/http-product-catalog-client-repository";

/**
 * Barrel TERPISAH dari `infrastructure/repositories/index.ts` — barrel utama
 * itu mengimpor repository yang lewat `serverFetch.ts` (`import "server-only"`)
 * secara statis, jadi mengimpor apa pun darinya dari komponen `"use client"`
 * ikut menarik kode server-only ke bundle browser dan build gagal.
 *
 * Isi berkas ini khusus repository yang aman & memang dipanggil langsung dari
 * client (transport `apiClient`, bukan `serverFetch`) — `productSearchRepository`
 * untuk fitur search product, `productCatalogClientRepository` untuk infinite
 * scroll `/shop` (`ShopProductGrid`, halaman ke-2 dst.).
 */
export const productSearchRepository: ProductSearchRepository = new HttpProductSearchRepository();

// Sengaja bernama beda dari `productCatalogRepository` di repositories/index.ts
// (implementasi `serverFetch`) supaya import yang salah barrel langsung
// kelihatan dari nama, bukan cuma dari path impor.
export const productCatalogClientRepository: ProductCatalogRepository =
  new HttpProductCatalogClientRepository();
