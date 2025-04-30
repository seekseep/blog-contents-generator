import { number, select } from "@inquirer/prompts";
import ora from "ora";

import { generateSubCategoriesPrompt } from "@/domain/openai/prompt/generateSubCategories";
import {
  createCategoryPathGetter,
  createChildCountByName,
  mergeCategories,
} from "@/domain/site";
import { Category } from "@/domain/types";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import ApplicationError from "../errors/ApplicationError";
import { Command } from "../types";
import {
  getCategoriesPath,
  readCategories,
  writeCategories,
} from "../util/category";
import { readPage } from "../util/page";

type GenerateSubCategoriesParams = {
  category: Category;
  count: number;
};

export const generateSubCategoriesCommand: Command<GenerateSubCategoriesParams> =
  {
    name: "サブカテゴリの作成",
    description: "サブカテゴリを作成します",
    askParams: async () => {
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
        message: "作成するサブの数:",
        default: 5,
        required: true,
      });

      return { category, count };
    },
    execute: async ({ category, count }: GenerateSubCategoriesParams) => {
      const homePage = readPage("_index");
      if (!homePage) throw new ApplicationError("Home page not found");

      const categories = readCategories();

      const [prompt, argsSchema] = generateSubCategoriesPrompt(
        homePage.body,
        category,
        count,
      );

      const spinner = ora(
        `「${category.name}」のサブカテゴリを生成中...`,
      ).start();
      const result = await callOpenAIFunction(prompt, argsSchema);
      const idProvidedCategories = result.categories.map((c) => ({
        ...c,
        parentName: category.name,
      }));
      spinner.stop();

      writeCategories(mergeCategories(categories, idProvidedCategories));

      console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
    },
  };
