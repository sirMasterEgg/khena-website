import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {getSiteSettings} from "@/application/use-cases/get-site-settings";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {isAvailable} from "@/domain/entities/product";
import {HeroSection} from "@/presentation/components/landing/hero-section";
import {CollectionCarousel} from "@/presentation/components/landing/collection-carousel";
import {MaterialsCarousel} from "@/presentation/components/landing/materials-carousel";
import {DesignedForLife} from "@/presentation/components/landing/designed-for-life";
import {ProductHeroBanner} from "@/presentation/components/landing/product-hero-banner";

export default async function Home() {
  const [collections, siteSettings, liveProducts] = await Promise.all([
    getVisibleCollections(),
    getSiteSettings(),
    getLiveProducts(),
  ]);

  const featuredProducts = liveProducts.filter(isAvailable).slice(0, 3);

  return (
    <>
      <HeroSection />
      <CollectionCarousel
        collections={collections}
        intervalMs={siteSettings.collectionCarouselIntervalMs}
      />
      <MaterialsCarousel />
      <DesignedForLife products={featuredProducts} />
      <ProductHeroBanner />
      <div className="h-35" aria-hidden="true" />
    </>
  );
}
