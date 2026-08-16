import type {ColorSwatchKey} from "@/domain/entities/color-swatch";

export type ProductStatus = "active" | "draft" | "archived";
export type ProductVisibility = "visible" | "hidden";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string; // slug -> Category.slug
  collection: string; // slug -> Collection.slug
  price: number;
  comparePrice?: number; // > price -> tampil badge SALE
  stock: number;
  status: ProductStatus;
  visibility: ProductVisibility;
  description: string;
  material: string;
  care: string[]; // list tips perawatan
  dimensions: Record<string, string | number>;
  images: string[]; // label placeholder, urutan selaras dengan tag view PDP
  lifestyle?: string[]; // caption gambar in-situ untuk lifestyle slider, fallback ke images[0]
  // Ekstensi dari tipe dasar bagian 2.5 issue.md — dibutuhkan galeri Pantone PDP
  // (bagian 4.5) yang tidak tercakup di snippet Product asli.
  colors: ColorSwatchKey[];
};

export function isLive(p: Product) {
  return p.status === "active" && p.visibility === "visible";
}
export function isAvailable(p: Product) {
  return isLive(p) && p.stock > 0;
}
export function isOnSale(p: Product) {
  return typeof p.comparePrice === "number" && p.comparePrice > p.price;
}

export const LOW_STOCK_THRESHOLD = 5;
export function isLowStock(p: Product) {
  return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
}
