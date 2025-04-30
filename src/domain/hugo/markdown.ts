import { Page, PageFrontMatter } from "../types";

export function creatFrontMatterString(frontmatter: PageFrontMatter): String {
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

export function buildPageFileContent(page: Page): string {
  const frontMatterString = creatFrontMatterString(page.frontmatter);
  return frontMatterString + "\n" + page.body;
}

function parseFrontMatter(frontmatterString: string): PageFrontMatter {
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
  const frontmatter: PageFrontMatter = {
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

export function parsePageContent(fileContent: string): Page | null {
  const [frontmatterString, body] = fileContent.split("---").slice(1);
  const frontmatter = parseFrontMatter(frontmatterString);
  return { frontmatter, body };
}
