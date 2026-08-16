import {isLive, type Product} from "@/domain/entities/product";
import type {ProductFilter} from "@/domain/repositories/product-repository";
import {productRepository} from "@/infrastructure/repositories";

export async function getLiveProducts(filter?: ProductFilter): Promise<Product[]> {
  const products = await productRepository.getAll(filter);
  return products.filter(isLive);
}
