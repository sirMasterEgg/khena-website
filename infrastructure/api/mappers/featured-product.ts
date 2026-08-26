import type {ProductDetail} from "@/infrastructure/api/schemas/product";
import type {FeaturedProduct} from "@/domain/entities/featured-product";

export function toFeaturedProduct(product: ProductDetail): FeaturedProduct {
  const firstVariant = product.variants[0];
  return {
    id: product.id,
    name: product.name,
    image: firstVariant?.image ?? product.media[0] ?? undefined,
    soldOut: (firstVariant?.stock ?? 0) <= 0,
  };
}
