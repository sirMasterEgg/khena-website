import {MobileMenu} from "@/presentation/components/layout/mobile-menu";
import {SearchOverlay} from "@/presentation/components/search/search-overlay";
import {CartDrawer} from "@/presentation/components/cart/cart-drawer";
import {AccountDrawer} from "@/presentation/components/account/account-drawer";
import type {ShopMenuGroup} from "@/presentation/components/layout/nav-data";
import type {Category} from "@/domain/entities/category";
import type {Collection} from "@/domain/entities/collection";
import type {Product} from "@/domain/entities/product";

/** Overlay global yang dipasang sekali di root layout — mobile menu & search. */
export function GlobalOverlays({
  products,
  categories,
  collections,
  shopGroups,
}: {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  shopGroups: ShopMenuGroup[];
}) {
  const categoryNameBySlug = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const collectionNameBySlug = Object.fromEntries(collections.map((c) => [c.slug, c.name]));

  return (
    <>
      <MobileMenu shopGroups={shopGroups} collections={collections} />
      <SearchOverlay
        products={products}
        categoryNameBySlug={categoryNameBySlug}
        collectionNameBySlug={collectionNameBySlug}
      />
      <CartDrawer />
      <AccountDrawer />
    </>
  );
}
