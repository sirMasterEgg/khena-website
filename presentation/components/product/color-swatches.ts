import {COLOR_SWATCHES, type ColorSwatch} from "@/domain/entities/color-swatch";
import type {Product} from "@/domain/entities/product";

/** Swatch warna yang tersedia untuk sebuah produk, urut sesuai `product.colors`. */
export function getProductColorSwatches(product: Product): ColorSwatch[] {
  return product.colors.map((key) => COLOR_SWATCHES[key]);
}
