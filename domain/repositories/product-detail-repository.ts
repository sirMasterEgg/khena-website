import type {ProductDetail} from "@/domain/entities/product-detail";
import type {ProductSummary} from "@/domain/entities/product-summary";

export interface ProductDetailRepository {
  /** `sku` = `products.base_sku`. Melempar `ApiRequestError` bila produk tidak ada. */
  getBySku(sku: string): Promise<ProductDetail>;
  /** Maksimal 8 produk terkait (contract.md Bagian 33). */
  getRelatedBySku(sku: string): Promise<ProductSummary[]>;
}
