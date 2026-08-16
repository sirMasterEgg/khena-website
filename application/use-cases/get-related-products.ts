import type {Product} from "@/domain/entities/product";
import {getLiveProducts} from "@/application/use-cases/get-live-products";

/** Produk lain di kategori atau koleksi yang sama, tidak termasuk produk itu sendiri. */
export async function getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
  const all = await getLiveProducts();
  return all
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.collection === product.collection)
    )
    .slice(0, limit);
}
