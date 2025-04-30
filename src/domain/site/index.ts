import { Category } from "../types";

export function mergeCategories(
  sourceCategories: Category[],
  targetCategories: Category[],
) {
  const categoryByName = new Map<string, Category>();
  sourceCategories.forEach((category) => {
    categoryByName.set(category.name, category);
  });
  targetCategories.forEach((category) => {
    categoryByName.set(category.name, category);
  });
  return Array.from(categoryByName.values());
}

export function createCategoryByName(
  categories: Category[],
): Map<string, Category> {
  const categoryById = new Map<string, Category>();
  categories.forEach((category) => {
    categoryById.set(category.name, category);
  });
  return categoryById;
}

export function createChildCountByName(
  categoreis: Category[],
): Record<string, number> {
  const childCountByName: Record<string, number> = {};
  categoreis.forEach((category) => {
    if (category.parentName) {
      childCountByName[category.parentName] =
        (childCountByName[category.parentName] || 0) + 1;
    }
  });
  return childCountByName;
}

export function createCategoryPathGetter(categoreis: Category[]) {
  const categoryByName = createCategoryByName(categoreis);
  return function getCategoryPath(category: Category): Category[] {
    if (category.parentName) {
      const parent = categoryByName.get(category.parentName);
      if (!parent) return [category];
      return [...getCategoryPath(parent), category];
    }
    return [category];
  };
}

export function createCtegoryOptionWithPath(categories: Category[]) {
  const categoryByName = createCategoryByName(categories);
  return function getCategoryRoute(category: Category): string {
    if (category.parentName) {
      const parent = categoryByName.get(category.parentName);
      if (!parent) return category.name;
      return `${getCategoryRoute(parent)} > ${category.name}`;
    }
    return category.name;
  };
}
