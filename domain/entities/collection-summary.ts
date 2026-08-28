/**
 * Bentuk koleksi yang dikirim API publik `GET /api/collections`
 * (contract.md Bagian 34). Sengaja terpisah dari `Collection` di
 * `collection.ts`: entity itu punya `description`, `status`, dan `visibility`
 * yang tidak ada di endpoint publik, dan masih dipakai carousel landing + PDP
 * yang belum dimigrasikan (D1).
 */
export type CollectionSummary = {
  id: string;
  slug: string;
  name: string;
  /** Gambar kartu koleksi; `undefined` bila belum diisi admin. */
  coverImage?: string;
  /** Banner koleksi. Sudah diambil dari API tapi belum dirender (D7). */
  heroImage?: string;
  /** Jumlah produk published dengan minimal satu varian visible. */
  totalProducts: number;
  /** `true` bila ada minimal satu varian dengan stok <= 0 di koleksi ini. */
  hasSoldOutProduct: boolean;
};
