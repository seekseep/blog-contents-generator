import path from "path";

export function buildPageFilePath(fileName: string): string {
  const filePath = path.resolve("out/content", fileName + ".md");
  return filePath;
}

export function buildDataFilePath(fileName: string): string {
  const filePath = path.resolve("out/data", fileName + ".json");
  return filePath;
}
