import type {
  CollectionCatalogPage,
  CollectionCatalogQuery,
} from "@/domain/repositories/collection-catalog-repository";
import {collectionCatalogRepository} from "@/infrastructure/repositories";

/**
 * Daftar koleksi untuk `/collections`.
 *
 * Tidak memfilter status/visibility: endpoint publik hanya mengirim koleksi
 * `published` (contract.md Bagian 30) — beda dari `getVisibleCollections()`
 * yang masih memfilter data mock untuk carousel landing & PDP.
 *
 * Sengaja melempar: yang menangkap kegagalan adalah halaman, supaya bisa
 * membedakan "koleksi tidak tersedia" dari "belum ada koleksi" (D8).
 */
export async function getCollectionCatalog(
  query: CollectionCatalogQuery = {}
): Promise<CollectionCatalogPage> {
  return collectionCatalogRepository.list(query);
}
