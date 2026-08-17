import type {Product} from "@/domain/entities/product";
import type {ProductFilter, ProductRepository} from "@/domain/repositories/product-repository";
import {MOCK_PRODUCTS} from "@/infrastructure/mock/data/products";

export class MockProductRepository implements ProductRepository {
  async getAll(filter?: ProductFilter): Promise<Product[]> {
    let products = MOCK_PRODUCTS;

    if (filter?.category) {
      products = products.filter((p) => p.category === filter.category);
    }
    if (filter?.collection) {
      products = products.filter((p) => p.collection === filter.collection);
    }

    return products;
  }

  async getById(id: string): Promise<Product | null> {
    return MOCK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}
