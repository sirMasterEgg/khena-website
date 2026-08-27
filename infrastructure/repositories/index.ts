import type {CategoryRepository} from "@/domain/repositories/category-repository";
import type {CollectionRepository} from "@/domain/repositories/collection-repository";
import type {JobRepository} from "@/domain/repositories/job-repository";
import type {ProductRepository} from "@/domain/repositories/product-repository";
import type {SiteSettingsRepository} from "@/domain/repositories/site-settings-repository";
import type {LandingContentRepository} from "@/domain/repositories/landing-content-repository";
import type {FeaturedProductRepository} from "@/domain/repositories/featured-product-repository";
import type {InfoContentRepository} from "@/domain/repositories/info-content-repository";
import type {NavigationRepository} from "@/domain/repositories/navigation-repository";
import {MockCategoryRepository} from "@/infrastructure/mock/repositories/mock-category-repository";
import {MockCollectionRepository} from "@/infrastructure/mock/repositories/mock-collection-repository";
import {MockJobRepository} from "@/infrastructure/mock/repositories/mock-job-repository";
import {MockProductRepository} from "@/infrastructure/mock/repositories/mock-product-repository";
import {MockSiteSettingsRepository} from "@/infrastructure/mock/repositories/mock-site-settings-repository";
import {HttpLandingContentRepository} from "@/infrastructure/repositories/http-landing-content-repository";
import {HttpFeaturedProductRepository} from "@/infrastructure/repositories/http-featured-product-repository";
import {HttpInfoContentRepository} from "@/infrastructure/repositories/http-info-content-repository";
import {HttpNavigationRepository} from "@/infrastructure/repositories/http-navigation-repository";

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
// categoryRepository/collectionRepository di atas: /shop, /categories, /collections,
// dan /product/[id] masih memakai mock dan akan dimigrasikan di issue terpisah.
export const navigationRepository: NavigationRepository = new HttpNavigationRepository();
