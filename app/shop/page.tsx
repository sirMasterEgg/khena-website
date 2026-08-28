import {Suspense} from "react";
import {getCatalogProducts} from "@/application/use-cases/get-catalog-products";
import {getShopFilters} from "@/application/use-cases/get-shop-filters";
import {getCollectionCatalog} from "@/application/use-cases/get-collection-catalog";
import type {ProductCatalogPage} from "@/domain/repositories/product-catalog-repository";
import {
  parseShopSortMode,
  sortSummariesSoldOutLast,
  toCatalogSortQuery,
} from "@/domain/services/product-sort";
import {ProductSummaryCard} from "@/presentation/components/product/product-summary-card";
import {ShopFilterBar} from "@/presentation/components/shop/shop-filter-bar";
import {ShopPagination} from "@/presentation/components/shop/shop-pagination";
import {Container} from "@/presentation/components/ui/container";
import {TextLink} from "@/presentation/components/ui/text-link";
import {RemoteImage} from "@/presentation/components/ui/remote-image";
import {RevealStagger} from "@/presentation/components/motion/reveal-stagger";

type ShopSearchParams = {[key: string]: string | string[] | undefined};

/** `?page=abc` atau di luar jangkauan tidak boleh sampai ke backend sebagai string mentah — jatuh ke 1 (Tahap 9 issue #32). */
function parsePageParam(value: string | string[] | undefined): number {
  const raw = typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(raw) && raw >= 1 ? raw : 1;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const collectionSlug = typeof params.collection === "string" ? params.collection : undefined;
  const sortMode = parseShopSortMode(params.sort);
  const page = parsePageParam(params.page);

  // Tidak pernah melempar — filter bar kosong lebih baik daripada /shop mati (D9).
  const filters = await getShopFilters();

  let catalog: ProductCatalogPage | null = null;
  try {
    catalog = await getCatalogProducts({
      category: categorySlug,
      collection: collectionSlug,
      page,
      ...toCatalogSortQuery(sortMode),
    });
  } catch (error) {
    console.error("[shop] gagal memuat katalog", error);
  }

  const activeCategory = categorySlug
    ? filters.categories.find((category) => category.slug === categorySlug)
    : undefined;
  const activeCollection = collectionSlug
    ? filters.collections.find((collection) => collection.slug === collectionSlug)
    : undefined;

  // `CatalogCollection` (filter bar) sengaja cuma punya id/slug/name (D6, issue
  // #34) — heroImage diambil ulang lewat collectionCatalogRepository khusus
  // untuk background hero. Tidak pernah melempar: hero tanpa gambar jatuh ke
  // PlaceholderImage lewat RemoteImage, bukan mematikan /shop.
  let collectionHeroImage: string | undefined;
  if (collectionSlug) {
    try {
      const collections = await getCollectionCatalog({limit: 48});
      collectionHeroImage = collections.items.find(
        (item) => item.slug === collectionSlug
      )?.heroImage;
    } catch (error) {
      console.error("[shop] gagal memuat heroImage koleksi", error);
    }
  }

  const heroEyebrow = activeCollection
    ? "COLLECTION"
    : activeCategory
      ? activeCategory.name.toUpperCase()
      : "ALL PIECES";
  const heroTitle = activeCollection?.name ?? activeCategory?.name ?? "Every Piece";

  const sortedItems = catalog ? sortSummariesSoldOutLast(catalog.items) : [];

  return (
    <>
      <div className="relative flex h-90 items-center justify-center overflow-hidden">
        <RemoteImage
          src={collectionHeroImage}
          alt={heroTitle}
          className="absolute inset-0 brightness-55"
          sizes="100vw"
          priority
        />
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
        ) : sortedItems.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">No pieces match this filter.</p>
        ) : (
          <>
            <RevealStagger className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {sortedItems.map((product) => (
                <ProductSummaryCard key={product.id} product={product} showPrice={false} />
              ))}
            </RevealStagger>

            <ShopPagination meta={catalog.meta} searchParams={params} />
          </>
        )}

        <div className="mt-15 text-center">
          <TextLink href="/shop">VIEW ALL PIECES</TextLink>
        </div>
      </Container>
    </>
  );
}
