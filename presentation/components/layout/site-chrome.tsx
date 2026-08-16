import type {ReactNode} from "react";
import {getPublishedCategories} from "@/application/use-cases/get-published-categories";
import {getVisibleCollections} from "@/application/use-cases/get-visible-collections";
import {getLiveProducts} from "@/application/use-cases/get-live-products";
import {Navbar} from "@/presentation/components/layout/navbar";
import {Footer} from "@/presentation/components/layout/footer";
import {GlobalOverlays} from "@/presentation/components/layout/global-overlays";
import {buildShopMenuGroups} from "@/presentation/components/layout/nav-data";

/**
 * Kerangka situs (navbar, footer, overlay global) dipasang sekali di root
 * layout. Data kategori/koleksi/produk diambil satu kali di sini lalu
 * diteruskan sebagai props ke Navbar & GlobalOverlays.
 */
export async function SiteChrome({children}: {children: ReactNode}) {
  const [categories, collections, products] = await Promise.all([
    getPublishedCategories(),
    getVisibleCollections(),
    getLiveProducts(),
  ]);

  const shopGroups = buildShopMenuGroups(categories, products);

  return (
    <>
      <Navbar shopGroups={shopGroups} collections={collections} />
      {children}
      <Footer />
      <GlobalOverlays products={products} categories={categories} collections={collections} />
    </>
  );
}
