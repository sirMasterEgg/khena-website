import {isOnSale, type Product} from "@/domain/entities/product";

/** Nominal hemat saat produk sedang SALE — dipakai PDP "Save IDR X". */
export function getSavingsAmount(product: Product): number {
  if (!isOnSale(product) || typeof product.comparePrice !== "number") return 0;
  return product.comparePrice - product.price;
}
