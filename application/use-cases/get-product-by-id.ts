import {isLive, type Product} from "@/domain/entities/product";
import {productRepository} from "@/infrastructure/repositories";

/** Produk sold out tetap dikembalikan (masih "live") — hanya draft/hidden yang disaring. */
export async function getProductById(id: string): Promise<Product | null> {
  const product = await productRepository.getById(id);
  if (!product || !isLive(product)) return null;
  return product;
}
