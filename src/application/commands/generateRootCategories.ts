import { number } from "@inquirer/prompts";
import ora from "ora";
import { v4 as uuid } from "uuid";

import { buildRootCategories } from "../../domain/openai/prompt/buildRootCategories";
import { mergeCategories } from "../../domain/site";
import { callOpenAIFunction } from "../../infrastructure/openai/client";
import ApplicationError from "../errors/ApplicationError";
import { Command } from "../types";
import {
  getCategoriesPath,
  readCategories,
  writeCategories,
} from "../util/category";
import { readPage } from "../util/page";

type GenerateRootCategories = {
  count: number;
};

export const generateRootCategoriesCommand: Command<GenerateRootCategories> = {
  name: "ルートカテゴリの作成",
  description: "ルートカテゴリを作成します",
  askParams: async () => {
    const count = await number({
      message: "作成するルートカテゴリの数:",
      default: 5,
      required: true,
    });

    return { count };
  },
  execute: async ({ count }: GenerateRootCategories) => {
    const homePage = readPage("_index");
    if (!homePage) throw new ApplicationError("Home page not found");

    const categories = readCategories();

    const [prompt, argsSchema] = buildRootCategories(homePage.body, count);

    const spinner = ora("AIに問い合わせ中...").start();
    const result = await callOpenAIFunction(prompt, argsSchema);
    const idProvidedCategories = result.categories.map((category) => ({
      ...category,
      id: uuid(),
    }));
    spinner.stop();

    const mergedCategories = mergeCategories(categories, idProvidedCategories);
    writeCategories(mergedCategories);

    console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
  },
};
