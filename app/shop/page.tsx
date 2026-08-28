import {Suspense} from "react";
import {getCatalogProducts} from "@/application/use-cases/get-catalog-products";
import {getShopFilters} from "@/application/use-cases/get-shop-filters";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
} from "@/domain/repositories/product-catalog-repository";
import {
  parseShopSortMode,
  sortSummariesSoldOutLast,
  toCatalogSortQuery,
} from "@/domain/services/product-sort";
import {ShopFilterBar} from "@/presentation/components/shop/shop-filter-bar";
import {ShopProductGrid} from "@/presentation/components/shop/shop-product-grid";
import {Container} from "@/presentation/components/ui/container";
import {TextLink} from "@/presentation/components/ui/text-link";
import {PlaceholderImage} from "@/presentation/components/ui/placeholder-image";

type ShopSearchParams = {[key: string]: string | string[] | undefined};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const collectionSlug = typeof params.collection === "string" ? params.collection : undefined;
  const sortMode = parseShopSortMode(params.sort);

  // Tidak pernah melempar — filter bar kosong lebih baik daripada /shop mati (D9).
  const filters = await getShopFilters();

  const catalogQuery: Omit<ProductCatalogQuery, "page"> = {
    category: categorySlug,
    collection: collectionSlug,
    ...toCatalogSortQuery(sortMode),
  };

  let catalog: ProductCatalogPage | null = null;
  try {
    // Infinite scroll: server hanya merender halaman pertama. Halaman
    // berikutnya diambil di browser oleh ShopProductGrid, bukan lewat ?page=.
    catalog = await getCatalogProducts({...catalogQuery, page: 1});
  } catch (error) {
    console.error("[shop] gagal memuat katalog", error);
  }

  const activeCategory = categorySlug
    ? filters.categories.find((category) => category.slug === categorySlug)
    : undefined;
  const activeCollection = collectionSlug
    ? filters.collections.find((collection) => collection.slug === collectionSlug)
    : undefined;

  const heroEyebrow = activeCollection
    ? "COLLECTION"
    : activeCategory
      ? activeCategory.name.toUpperCase()
      : "ALL PIECES";
  const heroTitle = activeCollection?.name ?? activeCategory?.name ?? "Every Piece";

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
          categories={filters.categories}
          activeCategorySlug={categorySlug}
          activeCollection={activeCollection}
          sortMode={sortMode}
        />
      </Suspense>

      <Container className="py-15 lg:py-30">
        {catalog === null ? (
          <p className="py-20 text-center text-sm text-muted">
            Catalogue is unavailable right now. Please try again shortly.
          </p>
        ) : catalog.items.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">No pieces match this filter.</p>
        ) : (
          // `key` memaksa remount tiap kali filter/sort berubah, supaya state
          // infinite scroll di ShopProductGrid (items yang sudah termuat, meta
          // halaman) tidak pernah tercampur antara query lama dan baru.
          <ShopProductGrid
            key={JSON.stringify(catalogQuery)}
            initialItems={sortSummariesSoldOutLast(catalog.items)}
            initialMeta={catalog.meta}
            query={catalogQuery}
          />
        )}

        <div className="mt-15 text-center">
          <TextLink href="/shop">VIEW ALL PIECES</TextLink>
        </div>
      </Container>
    </>
  );
}
