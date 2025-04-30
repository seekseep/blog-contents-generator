import { checkbox } from "@inquirer/prompts";
import ora from "ora";

import { buildgenerateCategoryPagePrompt } from "@/domain/openai/prompt/buildGenerateCategoryPagePrompt";
import { createCategoryPathGetter } from "@/domain/site";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import ApplicationError from "../errors/ApplicationError";
import { Command } from "../types";
import { readCategories } from "../util/category";
import { readCategoryPage, readPage, writePage } from "../util/page";

export const generateCategoryPagesCommand: Command = {
  name: "カテゴリページの作成",
  description: "カテゴリページを作成する",
  execute: async () => {
    const allCategories = readCategories();
    const getCategoryPath = createCategoryPathGetter(allCategories);
    const categories = await checkbox({
      message: "ページを作成するカテゴリを選択してください:",
      choices: allCategories
        .map((category) => {
          const path = getCategoryPath(category)
            .map((category) => category.name)
            .join(" / ");
          const fileExists = readCategoryPage(category) != null;
          const head = `(${fileExists ? "作成済" : "未作成"})`;
          const name = `${head} ${path}`;
          return {
            name,
            value: category,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    });

    const homePage = readPage("_index");
    if (!homePage) throw new ApplicationError("Home page not found");

    for (const category of categories) {
      const path = getCategoryPath(category);
      const parents = path.slice(0, -1);

      const spinner = ora(`「${category.name}」のページを生成中...`).start();
      const page = await callOpenAIFunction(
        ...buildgenerateCategoryPagePrompt(category, homePage.body, parents),
      );

      page.frontmatter.categories = path.map((category) => category.name);
      spinner.stop();

      const filePath = writePage(`categories/${category.slug}/_index`, page);

      console.info(`✅ ${category.name} のページを生成しました: ${filePath}`);
    }
  },
};
