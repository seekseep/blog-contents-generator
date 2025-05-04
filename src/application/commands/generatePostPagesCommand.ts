import fg from "fast-glob";
import fs from "fs";
import { dirname } from "path";

import { parsePageContent } from "@/domain/hugo/markdown";
import { Page } from "@/domain/types";

import { Command } from "../types";

export const generatePostPagesCommand: Command = {
  name: "記事ページの作成",
  description: "概要しか書かれていない記事ページの内容を作成する",
  execute: async () => {
    const paths = fg.sync("out/**/*.md", {
      dot: true,
      ignore: ["**/_index.md"],
    });

    const pageWithIndexes = paths
      .map((path) => {
        const directory = dirname(path);
        const indexFilePath = `${directory}/_index.md`;

        const fileContents = fs.readFileSync(path, "utf-8");
        const page: Page | null = parsePageContent(fileContents);
        if (!page?.frontmatter.body_generate_required) return null;

        const indexFilePathContent = fs.readFileSync(indexFilePath, "utf-8");
        const index: Page | null = parsePageContent(indexFilePathContent);
        if (!index) return;

        return { page, index } as {
          page: Page;
          index: Page;
        };
      })
      .filter(Boolean) as { page: Page; index: Page }[];

    console.log({ pageWithIndexes });

    const labels = pageWithIndexes.map(({ page, index }) => {
      const sectionName = index.frontmatter.title;
      const postName = page.frontmatter.title;
      const weight = page.frontmatter.weight;

      return `${sectionName} / ${postName} (${weight})`;
    });

    console.log(labels);
  },
};
