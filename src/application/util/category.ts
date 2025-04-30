import { z } from "zod";

import { parseDataOrElse } from "@/domain/hugo/data";
import { buildDataFilePath } from "@/domain/hugo/file";
import { Category } from "@/domain/types";

import { CategorySchema } from "../../domain/schemas/category";
import { readFile, writeFile } from "../../infrastructure/file";

export function getCategoriesPath() {
  return buildDataFilePath("categories");
}

export function readCategories() {
  const categoriesFilePath = getCategoriesPath();
  const categoriesFileContent = readFile(categoriesFilePath);
  if (!categoriesFileContent) {
    return [];
  }

  const categories = parseDataOrElse(
    categoriesFileContent,
    z.array(CategorySchema),
    [],
  );

  return categories;
}

export function writeCategories(categories: Category[]) {
  const categoriesFilePath = getCategoriesPath();
  const categoriesJson = JSON.stringify(categories, null, 2);
  writeFile(categoriesFilePath, categoriesJson);
}
