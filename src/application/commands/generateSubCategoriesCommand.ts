import { number, select } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateSubCategoriesPrompt } from "@/domain/openai/prompt/buildGenerateSubCategoriesPrompt";
import {
  createCategoryPathGetter,
  createChildCountByName,
  mergeCategories,
} from "@/domain/site";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import ApplicationError from "../errors/ApplicationError";
import { Command } from "../types";
import {
  getCategoriesPath,
  readCategories,
  writeCategories,
} from "../util/category";
import { readPage } from "../util/page";

export const generateSubCategoriesCommand: Command = {
  name: "サブカテゴリの作成",
  description: "親カテゴリを指定してサブカテゴリを作成します",
  execute: async () => {
    const categories = readCategories();
    const childCountByName = createChildCountByName(categories);
    const getCategoryPath = createCategoryPathGetter(categories);
    const category = await select({
      message: "サブカテゴリを作成するルートカテゴリを選択してください:",
      choices: categories
        .map((category) => {
          const path = getCategoryPath(category)
            .map((category) => category.name)
            .join(" / ");
          const count = childCountByName[category.name] ?? 0;
          const name = `${path} (${count})`;
          return {
            name,
            value: category,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    });

    const count = await number({
      message: "作成するカテゴリの数:",
      default: 5,
      required: true,
    });

    const homePage = readPage("_index");
    if (!homePage) throw new ApplicationError("Home page not found");

    const spinner = ora(
      `「${category.name}」のサブカテゴリを生成中...`,
    ).start();
    const result = await callOpenAIFunction(
      ...buildGenerateSubCategoriesPrompt(homePage.body, category, count),
    );
    const idProvidedCategories = result.categories.map((c) => ({
      ...c,
      parentName: category.name,
    }));
    spinner.stop();

    writeCategories(mergeCategories(categories, idProvidedCategories));

    console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
  },
};
