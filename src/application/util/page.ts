import { buildPageFilePath } from "@/domain/hugo/file";
import { buildPageFileContent, parsePageContent } from "@/domain/hugo/markdown";
import { Category, Page } from "@/domain/types";
import { readFile, writeFile } from "@/infrastructure/file";

export function readPage(fileName: string): Page | null {
  const filePath = buildPageFilePath(fileName);
  const fileContent = readFile(filePath);
  if (!fileContent) return null;
  return parsePageContent(fileContent);
}

export function writePage(fileName: string, page: Page) {
  const filePath = buildPageFilePath(fileName);
  const fileContent = buildPageFileContent(page);
  writeFile(filePath, fileContent);
  return filePath;
}

export function readCategoryPage(category: Category): Page | null {
  const filePath = buildPageFilePath(`categories/${category.slug}/_index`);
  const fileContent = readFile(filePath);
  if (!fileContent) return null;
  return parsePageContent(fileContent);
}
