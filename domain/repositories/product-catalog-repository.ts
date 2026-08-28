import type {ProductSummary} from "@/domain/entities/product-summary";
import type {PageMeta} from "@/domain/entities/pagination";

export type ProductCatalogSort = "name" | "price";
export type ProductCatalogOrderDir = "asc" | "desc";

export type ProductCatalogQuery = {
  search?: string;
  /** slug kategori */
  category?: string;
  /** slug koleksi */
  collection?: string;
  sort?: ProductCatalogSort;
  orderDir?: ProductCatalogOrderDir;
  page?: number;
  limit?: number;
};

export type ProductCatalogPage = {items: ProductSummary[]; meta: PageMeta};

/** Katalog produk `/shop`, dikerjakan lewat query param backend (D2, issue #32). */
export interface ProductCatalogRepository {
  list(query: ProductCatalogQuery): Promise<ProductCatalogPage>;
}
