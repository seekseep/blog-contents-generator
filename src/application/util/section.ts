import { Section, SectionPag } from "@/domain/types";

import { writePage } from "./page";

export async function writeSectionPage(
  section: Section,
  pages: SectionPag[],
): Promise<String[]> {
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

  for (const page of pages) {
    const pageFielPath = writePage(`${section.slug}/${page.slug}`, {
      frontmatter: {
        title: page.title,
        categories: section.categories,
        description: page.description,
        date: new Date().toISOString(),
        draft: true,
        weight: page.weight,
        bodyGenerateRequired: true,
      },
      body: page.chapters
        .map((chapter) => `# ${chapter.title}\n\n ${chapter.summary}`)
        .join("\n\n"),
    });
    filePaths.push(pageFielPath);
  }

  return filePaths;
}
