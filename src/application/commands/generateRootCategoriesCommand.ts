import { number } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateRootCategoriesPrompt } from "@/domain/openai/prompt/buildGenerateRootCategoriesPrompt";
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

export const generateRootCategoriesCommand: Command = {
  name: "ルートカテゴリの作成",
  description: "ルートカテゴリを作成します",
  execute: async () => {
    const count = await number({
      message: "作成するルートカテゴリの数:",
      default: 5,
      required: true,
    });

    const homePage = readPage("_index");
    if (!homePage) throw new ApplicationError("Home page not found");

    const spinner = ora("カテゴリを生成中...").start();
    const result = await callOpenAIFunction(
      ...buildGenerateRootCategoriesPrompt(homePage.body, count),
    );
    const categories = result.categories;
    spinner.stop();

    const currentCategories = readCategories();
    const mergedCategories = mergeCategories(currentCategories, categories);
    writeCategories(mergedCategories);

    console.info(`カテゴリファイルを更新しました: ${getCategoriesPath()}`);
  },
};
