import type {Product} from "@/domain/entities/product";

export type ProductSortMode = "featured" | "name-asc" | "price-asc" | "price-desc";

export const PRODUCT_SORT_OPTIONS: {value: ProductSortMode; label: string}[] = [
  {value: "featured", label: "Featured"},
  {value: "name-asc", label: "Name (A–Z)"},
  {value: "price-asc", label: "Price (Low → High)"},
  {value: "price-desc", label: "Price (High → Low)"},
];

/**
 * Urutkan produk sesuai mode, lalu pindahkan produk sold out ke akhir —
 * berlaku untuk SEMUA mode, termasuk "featured". Bagian 4.4 & 6.1 issue.md.
 */
export function sortProducts(products: Product[], mode: ProductSortMode = "featured"): Product[] {
  const sorted = [...products];

  switch (mode) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "price-asc":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "featured":
    default:
      break;
  }

  // Array.prototype.sort stabil sejak ES2019 — pengurutan ini hanya
  // memindahkan grup sold-out ke akhir tanpa mengubah urutan relatif di
  // dalam tiap grup.
  return sorted.sort((a, b) => Number(a.stock === 0) - Number(b.stock === 0));
}
