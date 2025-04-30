import { Section } from "@/domain/types";

import { writePage } from "./page";

export async function writeSectionPage(section: Section): Promise<String[]> {
  const filePaths: String[] = [];

  const indexFilePath = writePage(`${section.slug}/_index`, {
    frontmatter: {
      title: section.name,
      categories: section.categories,
      description: section.description,
      date: new Date().toISOString(),
      draft: true,
    },
    body: section.description,
  });
  filePaths.push(indexFilePath);

  for (const page of section.pages) {
    const pageFielPath = writePage(`${section.slug}/${page.slug}`, {
      frontmatter: {
        title: page.title,
        categories: section.categories,
        description: page.description,
        date: new Date().toISOString(),
        draft: true,
        weight: page.weight,
      },
      body: "",
    });
    filePaths.push(pageFielPath);
  }

  return filePaths;
}
