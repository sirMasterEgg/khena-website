import type {Product} from "@/domain/entities/product";

export type ProductFilter = {
  category?: string;
  collection?: string;
};

export interface ProductRepository {
  getAll(filter?: ProductFilter): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}
