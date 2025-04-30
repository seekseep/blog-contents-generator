import fs from "fs";
import { dirname } from "path";

export function writeFile(filePath: string, content: string): string {
  fs.mkdirSync(dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
  return filePath;
}

export function readFile(filePath: string): string | null {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, "utf-8");
}
