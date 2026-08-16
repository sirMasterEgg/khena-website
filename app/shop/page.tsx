import {Suspense} from "react";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {getPublishedCategories} from "@/application/use-cases/get-published-categories";
import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {sortProducts, type ProductSortMode} from "@/domain/services/product-sort";
import {ProductCard} from "@/presentation/components/product/product-card";
import {ShopFilterBar} from "@/presentation/components/shop/shop-filter-bar";
import {Container} from "@/presentation/components/ui/container";
import {TextLink} from "@/presentation/components/ui/text-link";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";

const SORT_MODES = new Set<ProductSortMode>(["featured", "name-asc", "price-asc", "price-desc"]);

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
}) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const collectionSlug = typeof params.collection === "string" ? params.collection : undefined;
  const sortParam = typeof params.sort === "string" ? params.sort : "featured";
  const sortMode: ProductSortMode = SORT_MODES.has(sortParam as ProductSortMode)
    ? (sortParam as ProductSortMode)
    : "featured";

  const [liveProducts, categories, collections] = await Promise.all([
    getLiveProducts(),
    getPublishedCategories(),
    getVisibleCollections(),
  ]);

  const filteredProducts = liveProducts.filter((product) => {
    if (categorySlug && product.category !== categorySlug) return false;
    if (collectionSlug && product.collection !== collectionSlug) return false;
    return true;
  });

  const sortedProducts = sortProducts(filteredProducts, sortMode);

  const activeCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug)
    : undefined;
  const activeCollection = collectionSlug
    ? collections.find((collection) => collection.slug === collectionSlug)
    : undefined;

  const heroEyebrow = activeCollection
    ? "COLLECTION"
    : activeCategory
      ? activeCategory.name.toUpperCase()
      : "ALL PIECES";
  const heroTitle = activeCollection?.name ?? activeCategory?.name ?? "Every Piece";

  const categoriesWithLiveProducts = new Set(liveProducts.map((product) => product.category));
  const availableCategories = categories.filter((category) =>
    categoriesWithLiveProducts.has(category.slug)
  );

  return (
    <>
      <div className="relative flex h-90 items-center justify-center overflow-hidden">
        <PlaceholderImage className="absolute inset-0 brightness-55" />
        <div className="relative z-10 text-center text-invert">
          <p className="text-eyebrow uppercase tracking-eyebrow">{heroEyebrow}</p>
          <h1 className="mt-4 font-display text-h2">{heroTitle}</h1>
        </div>
      </div>

      <Suspense>
        <ShopFilterBar
          categories={availableCategories}
          activeCategorySlug={categorySlug}
          activeCollection={activeCollection}
          sortMode={sortMode}
        />
      </Suspense>

      <Container className="py-15 lg:py-30">
        {sortedProducts.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">No pieces match this filter.</p>
        ) : (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showPrice={false}
                showQuickAdd={false}
              />
            ))}
          </div>
        )}

        <div className="mt-15 text-center">
          <TextLink href="/shop">VIEW ALL PIECES</TextLink>
        </div>
      </Container>
    </>
  );
}
