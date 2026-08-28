import type {CategoryRepository} from "@/domain/repositories/category-repository";
import type {CollectionRepository} from "@/domain/repositories/collection-repository";
import type {JobRepository} from "@/domain/repositories/job-repository";
import type {ProductRepository} from "@/domain/repositories/product-repository";
import type {SiteSettingsRepository} from "@/domain/repositories/site-settings-repository";
import type {LandingContentRepository} from "@/domain/repositories/landing-content-repository";
import type {FeaturedProductRepository} from "@/domain/repositories/featured-product-repository";
import type {InfoContentRepository} from "@/domain/repositories/info-content-repository";
import type {NavigationRepository} from "@/domain/repositories/navigation-repository";
import type {ProductCatalogRepository} from "@/domain/repositories/product-catalog-repository";
import type {CatalogTaxonomyRepository} from "@/domain/repositories/catalog-taxonomy-repository";
import type {CollectionCatalogRepository} from "@/domain/repositories/collection-catalog-repository";
import {MockCategoryRepository} from "@/infrastructure/mock/repositories/mock-category-repository";
import {MockCollectionRepository} from "@/infrastructure/mock/repositories/mock-collection-repository";
import {MockJobRepository} from "@/infrastructure/mock/repositories/mock-job-repository";
import {MockProductRepository} from "@/infrastructure/mock/repositories/mock-product-repository";
import {MockSiteSettingsRepository} from "@/infrastructure/mock/repositories/mock-site-settings-repository";
import {HttpLandingContentRepository} from "@/infrastructure/repositories/http-landing-content-repository";
import {HttpFeaturedProductRepository} from "@/infrastructure/repositories/http-featured-product-repository";
import {HttpInfoContentRepository} from "@/infrastructure/repositories/http-info-content-repository";
import {HttpNavigationRepository} from "@/infrastructure/repositories/http-navigation-repository";
import {HttpProductCatalogRepository} from "@/infrastructure/repositories/http-product-catalog-repository";
import {HttpCatalogTaxonomyRepository} from "@/infrastructure/repositories/http-catalog-taxonomy-repository";
import {HttpCollectionCatalogRepository} from "@/infrastructure/repositories/http-collection-catalog-repository";

// Satu-satunya berkas yang berubah saat backend REST siap (ISSUE-15) — bagian
// 2.2 issue.md. Tukar implementasi mock dengan implementasi Http* di sini,
// tanpa menyentuh use case atau komponen mana pun.

export const productRepository: ProductRepository = new MockProductRepository();
// nanti -> new HttpProductRepository(apiClient);

export const collectionRepository: CollectionRepository = new MockCollectionRepository();
// nanti -> new HttpCollectionRepository(apiClient);

export const categoryRepository: CategoryRepository = new MockCategoryRepository();
// nanti -> new HttpCategoryRepository(apiClient);

export const jobRepository: JobRepository = new MockJobRepository();
// nanti -> new HttpJobRepository(apiClient);

export const siteSettingsRepository: SiteSettingsRepository = new MockSiteSettingsRepository();
// nanti -> new HttpSiteSettingsRepository(apiClient);

// Konten CMS (landing & halaman info) — issue #27, sudah lewat backend REST.
export const landingContentRepository: LandingContentRepository = new HttpLandingContentRepository();

export const featuredProductRepository: FeaturedProductRepository = new HttpFeaturedProductRepository();

export const infoContentRepository: InfoContentRepository = new HttpInfoContentRepository();

// Navigasi navbar (issue ini) — sudah lewat backend REST. Sengaja TIDAK menukar
// categoryRepository/collectionRepository di atas: /categories dan /product/[id]
// masih memakai mock dan akan dimigrasikan di issue terpisah.
export const navigationRepository: NavigationRepository = new HttpNavigationRepository();

// Katalog /shop (issue #32) — sudah lewat backend REST. `productRepository` mock di atas
// SENGAJA dibiarkan: /product/[id], cart, dan wishlist masih memakai entity Product mock.
export const productCatalogRepository: ProductCatalogRepository =
  new HttpProductCatalogRepository();
export const catalogTaxonomyRepository: CatalogTaxonomyRepository =
  new HttpCatalogTaxonomyRepository();

// Halaman /collections (issue #34) — sudah lewat backend REST.
// `collectionRepository` mock di atas SENGAJA dibiarkan: carousel landing
// (app/page.tsx) dan PDP (app/product/[id]/page.tsx) masih memakai entity
// Collection mock dan akan dimigrasikan di issue terpisah (D1, D2).
export const collectionCatalogRepository: CollectionCatalogRepository =
  new HttpCollectionCatalogRepository();

// `productSearchRepository` (fitur search product) SENGAJA TIDAK ada di sini.
// Berkas ini mengimpor http-navigation-repository.ts -> server-fetch.ts, yang
// `import "server-only"` — mengimpor apa pun dari barrel ini di komponen
// "use client" (search-overlay.tsx) menarik kode server-only itu ke bundle
// browser dan build gagal. Lihat infrastructure/repositories/client.ts.
