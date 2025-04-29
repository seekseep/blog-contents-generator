import { buildPageFilePath, parsePageContent } from "../../domain/hugo/util";
import { HugoPage } from "../../domain/types";
import { readFile, writeFile } from "../../infrastructure/file";

export function readPage(fileName: string): HugoPage | null {
  const filePath = buildPageFilePath(fileName);
  const fileContent = readFile(filePath);
  return parsePageContent(fileContent);
}

export function writePage(fileName: string, content: HugoPage) {
  const filePath = buildPageFilePath(fileName);
  const fileContent = JSON.stringify(content, null, 2);
  writeFile(filePath, fileContent);
}
