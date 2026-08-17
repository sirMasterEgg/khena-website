import type {Collection} from "@/domain/entities/collection";
import type {CollectionRepository} from "@/domain/repositories/collection-repository";
import {MOCK_COLLECTIONS} from "@/infrastructure/mock/data/collections";

export class MockCollectionRepository implements CollectionRepository {
  async getAll(): Promise<Collection[]> {
    return MOCK_COLLECTIONS;
  }

  async getBySlug(slug: string): Promise<Collection | null> {
    return MOCK_COLLECTIONS.find((c) => c.slug === slug) ?? null;
  }
}
