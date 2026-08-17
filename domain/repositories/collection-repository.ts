import type {Collection} from "@/domain/entities/collection";

export interface CollectionRepository {
  getAll(): Promise<Collection[]>;
  getBySlug(slug: string): Promise<Collection | null>;
}
