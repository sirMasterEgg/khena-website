import {LOW_STOCK_THRESHOLD} from "@/domain/entities/product";

/** Satu varian produk — sumber harga, stok, dan warna di PDP (D4). */
export type ProductVariant = {
  /** uuid varian. Hanya untuk `key` React, bukan untuk memanggil API. */
  id: string;
  /** `detail_products.detail_product_sku` — SKU **varian**, bukan SKU produk. */
  sku: string;
  image?: string;
  colorName?: string;
  /** mis. `#B91C1C`. Dipakai langsung sebagai warna chip. */
  colorHex?: string;
  price: number;
  discountPercent: number;
  priceAfterDiscount: number;
  stock: number;
};

export type ProductDimensionSet = {
  width?: number;
  depth?: number;
  height?: number;
  weight?: number;
  image?: string;
};

/**
 * Detail produk publik — contract.md Bagian 33 (`GET /api/products/:sku`).
 * Sengaja terpisah dari entity `Product` mock: tidak ada `category`,
 * `collection`, caption lifestyle, maupun `colors` swatch hardcoded di
 * response API (D7). Jangan menambahkan field yang tidak dikirim backend.
 */
export type ProductDetail = {
  id: string;
  /** `products.base_sku` — SKU **produk**, yang dipakai di URL. */
  sku: string;
  name: string;
  description?: string;
  materials?: string;
  careInstructions: string[];
  dimensions: {product?: ProductDimensionSet; box?: ProductDimensionSet};
  /**
   * Foto showcase, sudah terurut dari backend. Mengisi banner lifestyle
   * (D5b) — BUKAN galeri utama, galeri memakai gambar varian (D5).
   */
  media: string[];
  variants: ProductVariant[];
};

/** Varian default PDP: varian pertama, sama dengan yang diwakili `productSummary`. */
export function getDefaultVariant(product: ProductDetail): ProductVariant | undefined {
  return product.variants[0];
}

export function isVariantSoldOut(variant: ProductVariant): boolean {
  return variant.stock <= 0;
}

export function isVariantLowStock(variant: ProductVariant): boolean {
  return variant.stock > 0 && variant.stock <= LOW_STOCK_THRESHOLD;
}

export function isVariantOnSale(variant: ProductVariant): boolean {
  return variant.discountPercent > 0 && variant.priceAfterDiscount < variant.price;
}

/** Nominal hemat untuk teks "Save IDR X" — pengganti `getSavingsAmount` lama. */
export function getVariantSavings(variant: ProductVariant): number {
  return isVariantOnSale(variant) ? variant.price - variant.priceAfterDiscount : 0;
}

/** `{width: 200, depth: 90, height: 85}` -> `"W 200 × D 90 × H 85 cm"`; `undefined` bila kosong. */
export function formatDimensionSet(set?: ProductDimensionSet): string | undefined {
  if (!set) return undefined;
  const parts = [
    set.width !== undefined ? `W ${set.width}` : undefined,
    set.depth !== undefined ? `D ${set.depth}` : undefined,
    set.height !== undefined ? `H ${set.height}` : undefined,
  ].filter(Boolean);
  return parts.length > 0 ? `${parts.join(" × ")} cm` : undefined;
}
