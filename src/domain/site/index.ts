import { Category } from "../types";

export function mergeCategories(
  sourceCategories: Category[],
  targetCategories: Category[],
) {
  const categoryById = new Map<string, Category>();
  sourceCategories.forEach((category) => {
    categoryById.set(category.id, category);
  });
  targetCategories.forEach((category) => {
    categoryById.set(category.id, category);
  });
  return Array.from(categoryById.values());
}
