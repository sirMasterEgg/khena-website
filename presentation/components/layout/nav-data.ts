import type {Category, CategoryRoom} from "@/domain/entities/category";
import type {Product} from "@/domain/entities/product";

export const NAV_LINKS = [
  {label: "SHOP", href: "/shop"},
  {label: "COLLECTION", href: "/collections"},
  {label: "CONTACT", href: "/contact"},
  {label: "SHOWROOM", href: "/showroom"},
  {label: "ABOUT US", href: "/about"},
] as const;

const ROOM_ORDER: CategoryRoom[] = ["living-room", "dining-room", "bed-room"];

const ROOM_LABELS: Record<CategoryRoom, string> = {
  "living-room": "Living Room",
  "dining-room": "Dining Room",
  "bed-room": "Bed Room",
};

export type ShopMenuGroup = {
  room: CategoryRoom;
  label: string;
  categories: Category[];
};

/**
 * Kelompokkan kategori per ruangan untuk mega dropdown SHOP — bagian 3.1
 * issue.md. Hanya menyertakan grup yang punya minimal satu kategori dengan
 * produk live.
 */
export function buildShopMenuGroups(
  categories: Category[],
  liveProducts: Product[]
): ShopMenuGroup[] {
  const categoriesWithLiveProducts = new Set(liveProducts.map((p) => p.category));

  return ROOM_ORDER.map((room) => ({
    room,
    label: ROOM_LABELS[room],
    categories: categories.filter(
      (category) => category.room === room && categoriesWithLiveProducts.has(category.slug)
    ),
  })).filter((group) => group.categories.length > 0);
}
