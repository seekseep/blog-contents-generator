import { select } from "@inquirer/prompts";
import fg from "fast-glob";
import fs from "fs";
import ora from "ora";
import { dirname } from "path";

import { parsePageContent } from "@/domain/hugo/markdown";
import { buildGeneratePostPageInCoursePrompt } from "@/domain/openai/prompt/buildGeneratePostPageInCoursePrompt";
import { Page } from "@/domain/types";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import { Command } from "../types";
import { readCategories } from "../util/category";
import { readPage, writePage } from "../util/page";

export const generatePostPagesCommand: Command = {
  name: "記事ページの作成",
  description: "概要しか書かれていない記事ページの内容を作成する",
  execute: async () => {
    const paths = fg.sync("out/**/*.md", {
      dot: true,
      ignore: ["**/_index.md"],
    });

    const categories = readCategories();

    const pageWithIndexes = paths
      .map((path) => {
        const directory = dirname(path);
        const indexFilePath = `${directory}/_index.md`;

        const name = path.replace(/^out\/content\//, "").replace(/\.md$/, "");

        const fileContents = fs.readFileSync(path, "utf-8");
        const page: Page | null = parsePageContent(fileContents);
        if (!page?.frontmatter.bodyGenerateRequired) return null;

        const indexFilePathContent = fs.readFileSync(indexFilePath, "utf-8");
        const index: Page | null = parsePageContent(indexFilePathContent);

        if (!index) return null;

        return { page, index, name };
      })
      .filter(Boolean) as { page: Page; index: Page; name: string }[];

    const choices = pageWithIndexes.map(({ page, index, name }) => {
      const sectionName = index.frontmatter.title;
      const postName = page.frontmatter.title;
      const weight = page.frontmatter.weight;

      return {
        name: `${sectionName} / ${postName} (${weight})`,
        value: { page, index, name },
      };
    });

    const {
      page: targetPage,
      index: coursePage,
      name,
    } = await select({
      message: "記事ページを選択してください",
      choices: choices,
    });

    const homePage = readPage("_index");
    if (!homePage) throw new Error("Home page not found");
    const categoryPages = categories.filter((category) => {
      return targetPage.frontmatter.categories?.includes(category.name);
    });

    const spinner = ora("記事ページを作成中").start();
    const generatedPage = await callOpenAIFunction(
      ...buildGeneratePostPageInCoursePrompt(
        homePage,
        categoryPages,
        coursePage,
        targetPage,
      ),
    );
    spinner.stop();

    const filePath = writePage(name, {
      frontmatter: {
        ...targetPage.frontmatter,
        bodyGenerateRequired: false,
      },
      body: generatedPage.body,
    });

    console.log(
      `${targetPage.frontmatter.title}の内容を作成しました: ${filePath}`,
    );
  },
};
