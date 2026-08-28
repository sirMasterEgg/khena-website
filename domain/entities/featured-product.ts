/**
 * Produk "Designed for Life" di landing — bagian Fase 6 issue #27. Sengaja
 * minimal: kartu di section ini tidak menampilkan harga maupun quick-add
 * (lihat `DesignedForLife` sebelumnya: `showPrice={false}`,
 * `showQuickAdd={false}`). Entity terpisah dari `Product` mock supaya issue
 * ini tidak menyeret migrasi katalog produk (di luar scope).
 */
export type FeaturedProduct = {
  id: string;
  name: string;
  sku: string;
  image?: string;
  soldOut: boolean;
};
