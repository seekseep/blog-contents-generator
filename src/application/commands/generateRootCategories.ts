import { number } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateRootCategoriesPrompt } from "@/domain/openai/prompt/generateRootCategories";
import { mergeCategories } from "@/domain/site";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

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

    const [prompt, argsSchema] = buildGenerateRootCategoriesPrompt(
      homePage.body,
      count,
    );

    const spinner = ora("カテゴリを生成中...").start();
    const result = await callOpenAIFunction(prompt, argsSchema);
    const categories = result.categories;
    spinner.stop();

    const currentCategories = readCategories();
    const mergedCategories = mergeCategories(currentCategories, categories);
    writeCategories(mergedCategories);

    console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
  },
};
