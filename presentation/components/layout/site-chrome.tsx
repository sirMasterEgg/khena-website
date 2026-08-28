import type {ReactNode} from "react";
import {getNavigationMenu} from "@/application/use-cases/get-navigation-menu";
import {Navbar} from "@/presentation/components/layout/navbar";
import {Footer} from "@/presentation/components/layout/footer";
import {GlobalOverlays} from "@/presentation/components/layout/global-overlays";

/**
 * Kerangka situs (navbar, footer, overlay global) dipasang sekali di root
 * layout. Sebelum fitur search product, berkas ini juga mengambil
 * categories/collections/products mock hanya untuk diteruskan ke
 * `SearchOverlay`; sekarang `SearchOverlay` mengambil hasil pencariannya
 * sendiri lewat API, jadi fetch itu dihapus dari sini.
 */
export async function SiteChrome({children}: {children: ReactNode}) {
  const navigation = await getNavigationMenu();

  return (
    <>
      <Navbar shopGroups={navigation.shopGroups} collections={navigation.collections} />
      {children}
      <Footer />
      <GlobalOverlays shopGroups={navigation.shopGroups} navCollections={navigation.collections} />
    </>
  );
}
