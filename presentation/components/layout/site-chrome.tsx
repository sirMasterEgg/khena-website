import type {ReactNode} from "react";
import {getNavigationMenu} from "@/application/use-cases/get-navigation-menu";
import {getPublishedCategories} from "@/application/use-cases/get-published-categories";
import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {Navbar} from "@/presentation/components/layout/navbar";
import {Footer} from "@/presentation/components/layout/footer";
import {GlobalOverlays} from "@/presentation/components/layout/global-overlays";

/**
 * Kerangka situs (navbar, footer, overlay global) dipasang sekali di root
 * layout. Data kategori/koleksi/produk diambil satu kali di sini lalu
 * diteruskan sebagai props ke Navbar & GlobalOverlays.
 */
export async function SiteChrome({children}: {children: ReactNode}) {
  // `categories`, `collections`, dan `products` di bawah masih dari mock — dipakai
  // SearchOverlay, yang belum dimigrasikan (di luar lingkup issue navbar).
  const [navigation, categories, collections, products] = await Promise.all([
    getNavigationMenu(),
    getPublishedCategories(),
    getVisibleCollections(),
    getLiveProducts(),
  ]);

  return (
    <>
      <Navbar shopGroups={navigation.shopGroups} collections={navigation.collections} />
      {children}
      <Footer />
      <GlobalOverlays
        products={products}
        categories={categories}
        collections={collections}
        shopGroups={navigation.shopGroups}
        navCollections={navigation.collections}
      />
    </>
  );
}
