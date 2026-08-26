import type {FeaturedProduct} from "@/domain/entities/featured-product";
import {featuredProductRepository} from "@/infrastructure/repositories";

export async function getFeaturedProducts(ids: string[]): Promise<FeaturedProduct[]> {
  if (ids.length === 0) return [];
  return featuredProductRepository.getByIds(ids);
}
