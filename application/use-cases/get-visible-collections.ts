import {isCollectionVisible, type Collection} from "@/domain/entities/collection";
import {collectionRepository} from "@/infrastructure/repositories";

export async function getVisibleCollections(): Promise<Collection[]> {
  const collections = await collectionRepository.getAll();
  return collections.filter(isCollectionVisible);
}
