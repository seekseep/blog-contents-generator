import path from "path";
import { z } from "zod";

import { HugoFrontMatter, HugoPage } from "../types";

export function buildPageFilePath(fileName: string): string {
  const filePath = path.resolve("out/content", fileName + ".md");
  return filePath;
}

export function buildDataFilePath(fileName: string): string {
  const filePath = path.resolve("out/data", fileName + ".json");
  return filePath;
}

export function creatFrontMatterString(frontmatter: HugoFrontMatter) {
  const lines: string[] = [];

  lines.push("---");
  lines.push(`title: ${frontmatter.title}`);
  lines.push(`description: ${frontmatter.description}`);
  lines.push(`date: ${frontmatter.date}`);
  if (typeof frontmatter.draft !== "undefined") {
    lines.push(`draft: ${frontmatter.draft}`);
  }
  if (typeof frontmatter.categories !== "undefined") {
    lines.push(`categories: ${frontmatter.categories.join(", ")}`);
  }
  if (typeof frontmatter.slug !== "undefined") {
    lines.push(`slug: ${frontmatter.slug}`);
  }
  if (typeof frontmatter.weight !== "undefined") {
    lines.push(`weight: ${frontmatter.weight}`);
  }
  if (typeof frontmatter.author !== "undefined") {
    lines.push(`author: ${frontmatter.author}`);
  }

  lines.push("---");

  return lines.join("\n");
}

export function buildPageFileContent(page: HugoPage): string {
  const frontMatterString = creatFrontMatterString(page.frontmatter);
  return frontMatterString + "\n" + page.body;
}

function parseFrontMatter(frontmatterString: string): HugoFrontMatter {
  const lines = frontmatterString.split("\n");
  const values: Record<string, any> = {};

  for (const line of lines) {
    const [key, value] = line.split(":").map((s) => s.trim());
    if (key && value) values[key] = value;
  }

  const title = values.title || "";
  const description = values.description || "";
  const date = values.date || new Date().toISOString();
  const draft = values.draft === "true" ? true : false;
  const categories = values.categories
    ? values.categories.split(",").map((s: string) => s.trim())
    : [];
  const slug = values.slug || "";
  const weight = values.weight ? parseInt(values.weight) : undefined;
  const author = values.author || "";
  const frontmatter: HugoFrontMatter = {
    title,
    description,
    date,
    draft,
    categories,
    slug,
    weight,
    author,
  };

  return frontmatter;
}

export function parsePageContent(fileContent: string): HugoPage | null {
  const [frontmatterString, body] = fileContent.split("---").slice(1);
  const frontmatter = parseFrontMatter(frontmatterString);
  return { frontmatter, body };
}

export function parseDataOrElse<T>(
  data: string | null,
  schema: z.Schema<T>,
  defaultValue: T,
): T {
  if (!data) return defaultValue;
  try {
    const parsed = JSON.parse(data);
    return schema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse data:", e);
    return defaultValue;
  }
}
