import {isCategoryPublished, type Category} from "@/domain/entities/category";
import {categoryRepository} from "@/infrastructure/repositories";

export async function getPublishedCategories(): Promise<Category[]> {
  const categories = await categoryRepository.getAll();
  return categories.filter(isCategoryPublished);
}
