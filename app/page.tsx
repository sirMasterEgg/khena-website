import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {getSiteSettings} from "@/application/use-cases/get-site-settings";
import {getLandingContent} from "@/application/use-cases/get-landing-content";
import {getFeaturedProducts} from "@/application/use-cases/get-featured-products";
import {HeroSection} from "@/presentation/components/landing/hero-section";
import {CollectionCarousel} from "@/presentation/components/landing/collection-carousel";
import {SignatureCollectionBlock} from "@/presentation/components/landing/signature-collection-block";
import {MaterialsCarousel} from "@/presentation/components/landing/materials-carousel";
import {DesignedForLife} from "@/presentation/components/landing/designed-for-life";
import {ProductHeroBanner} from "@/presentation/components/landing/product-hero-banner";
import {SIGNATURE_COLLECTION_VARIANT} from "@/presentation/lib/landing-variants";

export default async function Home() {
  const isCarousel: boolean = SIGNATURE_COLLECTION_VARIANT === "carousel";

  // Varian "block" tidak butuh data koleksi sama sekali — jangan menembak
  // endpoint yang hasilnya dibuang.
  const [landing, collections, siteSettings] = await Promise.all([
    getLandingContent(),
    isCarousel ? getVisibleCollections() : Promise.resolve([]),
    isCarousel ? getSiteSettings() : Promise.resolve(null),
  ]);

  // Berurutan (butuh landing.featuredProductIds dulu) — tidak bisa masuk
  // Promise.all yang sama.
  const featuredProducts = await getFeaturedProducts(landing.featuredProductIds);

  return (
    <>
      <HeroSection content={landing.mainHero} />
      {isCarousel && siteSettings ? (
        <CollectionCarousel
          title={landing.signatureCollection.title}
          collections={collections}
          intervalMs={siteSettings.collectionCarouselIntervalMs}
        />
      ) : (
        <SignatureCollectionBlock content={landing.signatureCollection} />
      )}
      <MaterialsCarousel content={landing.craftmanship} />
      <DesignedForLife products={featuredProducts} />
      <ProductHeroBanner content={landing.bottomHero} />
      <div className="h-35" aria-hidden="true" />
    </>
  );
}
