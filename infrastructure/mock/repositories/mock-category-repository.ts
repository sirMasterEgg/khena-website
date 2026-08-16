import type {Category} from "@/domain/entities/category";
import type {CategoryRepository} from "@/domain/repositories/category-repository";
import {MOCK_CATEGORIES} from "@/infrastructure/mock/data/categories";

export class MockCategoryRepository implements CategoryRepository {
  async getAll(): Promise<Category[]> {
    return MOCK_CATEGORIES;
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}
