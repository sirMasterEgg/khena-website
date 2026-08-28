import {MobileMenu} from "@/presentation/components/layout/mobile-menu";
import {SearchOverlay} from "@/presentation/components/search/search-overlay";
import {CartDrawer} from "@/presentation/components/cart/cart-drawer";
import {AccountDrawer} from "@/presentation/components/account/account-drawer";
import type {NavCollection, NavRoomGroup} from "@/domain/entities/navigation";

/**
 * Overlay global yang dipasang sekali di root layout — mobile menu & search.
 * `SearchOverlay` tidak lagi menerima produk/kategori/koleksi lewat props
 * (bagian fitur search product): ia mengambil hasil pencariannya sendiri
 * dari API lewat `apiClient`, bukan dari data yang di-fetch Server Component
 * di sini.
 */
export function GlobalOverlays({
  shopGroups,
  navCollections,
}: {
  shopGroups: NavRoomGroup[];
  navCollections: NavCollection[];
}) {
  return (
    <>
      <MobileMenu shopGroups={shopGroups} collections={navCollections} />
      <SearchOverlay />
      <CartDrawer />
      <AccountDrawer />
    </>
  );
}
