/**
 * Bentuk ringkas produk untuk listing publik (`productSummary`, contract.md
 * Bagian 30) — dipakai fitur search. Sengaja terpisah dari `Product`:
 * endpoint publik hanya mewakili **varian pertama** (bukan termurah/
 * terpopuler) dan tidak membawa slug kategori/koleksi, deskripsi, dimensi,
 * dsb. Memaksakan `Product` di sini berarti mengarang field yang tidak ada.
 */
export type ProductSummary = {
  id: string;
  name: string;
  sku: string;
  /** URL gambar varian pertama, atau `undefined` bila belum ada. */
  image?: string;
  price: number;
  discountPercent: number;
  priceAfterDiscount: number;
  stock: number;
};

export function isProductSummarySoldOut(p: ProductSummary): boolean {
  return p.stock <= 0;
}

export function isProductSummaryOnSale(p: ProductSummary): boolean {
  return p.discountPercent > 0 && p.priceAfterDiscount < p.price;
}
