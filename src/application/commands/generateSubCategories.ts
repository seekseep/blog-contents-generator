import { number, select } from "@inquirer/prompts";
import ora from "ora";
import { v4 as uuid } from "uuid";

import { buildSubCategories } from "../../domain/openai/prompt/buildSubCategories";
import { mergeCategories } from "../../domain/site";
import { Category } from "../../domain/types";
import { callOpenAIFunction } from "../../infrastructure/openai/client";
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

function createCategoryByIdMap(categories: Category[]): Map<string, Category> {
  const categoryById = new Map<string, Category>();
  categories.forEach((category) => {
    categoryById.set(category.id, category);
  });
  return categoryById;
}

function createChildCountById(categoreis: Category[]): Record<string, number> {
  const childCountById: Record<string, number> = {};
  categoreis.forEach((category) => {
    if (category.parentId) {
      childCountById[category.parentId] =
        (childCountById[category.parentId] || 0) + 1;
    }
  });
  return childCountById;
}

function createCategoryRouteGetter(categoreis: Category[]) {
  const categoryById = createCategoryByIdMap(categoreis);
  return function getCategoryRoute(category: Category): Category[] {
    if (category.parentId) {
      const parent = categoryById.get(category.parentId);
      if (!parent) return [category];
      return [...getCategoryRoute(parent), category];
    }
    return [category];
  };
}

export const generateSubCategoriesCommand: Command<GenerateSubCategoriesParams> =
  {
    name: "サブカテゴリの作成",
    description: "サブカテゴリを作成します",
    askParams: async () => {
      const categories = readCategories();
      const childCountById = createChildCountById(categories);
      const getCategoryRoute = createCategoryRouteGetter(categories);
      const category = await select({
        message: "サブカテゴリを作成するルートカテゴリを選択してください:",
        choices: categories.map((category) => ({
          name: `${getCategoryRoute(category)
            .map((category) => category.name)
            .join(" > ")} (${childCountById[category.id] || 0})`,
          value: category,
        })),
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

      const [prompt, argsSchema] = buildSubCategories(
        homePage.body,
        category,
        count,
      );

      const spinner = ora("AIに問い合わせ中...").start();
      const result = await callOpenAIFunction(prompt, argsSchema);
      const idProvidedCategories = result.categories.map((c) => ({
        ...c,
        id: uuid(),
        parentId: category.id,
      }));
      spinner.stop();

      writeCategories(mergeCategories(categories, idProvidedCategories));

      console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
    },
  };
