import type {FeaturedProduct} from "@/domain/entities/featured-product";

export interface FeaturedProductRepository {
  getByIds(ids: string[]): Promise<FeaturedProduct[]>;
}
