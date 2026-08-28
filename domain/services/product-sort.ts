import type {Product} from "@/domain/entities/product";
import type {ProductSummary} from "@/domain/entities/product-summary";
import type {
  ProductCatalogOrderDir,
  ProductCatalogSort,
} from "@/domain/repositories/product-catalog-repository";

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

/** Mode sort dropdown `/shop` setelah tersambung ke katalog backend — issue #32. */
export type ShopSortMode = "featured" | "name-asc" | "price-asc" | "price-desc";

/** Label tetap sama seperti dropdown yang sekarang. */
export const SHOP_SORT_OPTIONS: {value: ShopSortMode; label: string}[] = [
  {value: "featured", label: "Featured"},
  {value: "name-asc", label: "Name (A–Z)"},
  {value: "price-asc", label: "Price (Low → High)"},
  {value: "price-desc", label: "Price (High → Low)"},
];

/** UI mode → query param `GET /api/products` (contract.md Bagian 33). */
export function toCatalogSortQuery(
  mode: ShopSortMode
): {sort?: ProductCatalogSort; orderDir?: ProductCatalogOrderDir} {
  switch (mode) {
    case "name-asc":
      return {sort: "name", orderDir: "asc"};
    case "price-asc":
      return {sort: "price", orderDir: "asc"};
    case "price-desc":
      return {sort: "price", orderDir: "desc"};
    case "featured":
    default:
      return {}; // pakai default backend (name asc) — backend tidak punya "featured"
  }
}

const SHOP_SORT_MODES = new Set<ShopSortMode>(["featured", "name-asc", "price-asc", "price-desc"]);

/** Nilai dari query string tidak dipercaya — apa pun di luar daftar jadi "featured". */
export function parseShopSortMode(value: unknown): ShopSortMode {
  return typeof value === "string" && SHOP_SORT_MODES.has(value as ShopSortMode)
    ? (value as ShopSortMode)
    : "featured";
}

/**
 * Pindahkan produk sold out ke akhir. Keterbatasan yang diterima (D4): hanya berlaku
 * di dalam satu halaman paginasi, karena backend tidak bisa mengurutkan berdasar stok.
 * Pakai sort stabil supaya urutan dari backend tidak teracak.
 */
export function sortSummariesSoldOutLast(items: ProductSummary[]): ProductSummary[] {
  return [...items].sort((a, b) => Number(a.stock <= 0) - Number(b.stock <= 0));
}
