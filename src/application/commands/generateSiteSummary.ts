import { input } from "@inquirer/prompts";
import ora from "ora";

import {
  buildPageFileContent,
  buildPageFilePath,
} from "../../domain/hugo/util";
import { buildHomePagePrompt } from "../../domain/openai/prompt/buildHomePagePrompt";
import { writeFile } from "../../infrastructure/file";
import { callOpenAIFunction } from "../../infrastructure/openai/client";
import { Command } from "../types";

type GenerateSiteSummaryParams = {
  keyword: string;
};

export const generateSiteSummaryCommand: Command<GenerateSiteSummaryParams> = {
  name: "サイトの概要を作成",
  description: "サイトの概要を作成します。",
  askParams: async () => {
    const keyword = await input({
      message: "サイトのキーワードを入力してください:",
      default: "プログラミング",
    });

    return { keyword };
  },
  execute: async ({ keyword }: GenerateSiteSummaryParams) => {
    const [prompt, argsSchema] = buildHomePagePrompt(keyword);
    const spinner = ora("AIに問い合わせ中...").start();
    const hugoPage = await callOpenAIFunction(prompt, argsSchema);
    spinner.stop();

    const filePath = buildPageFilePath("_index");
    const fileContent = buildPageFileContent(hugoPage);
    writeFile(filePath, fileContent);

    console.info(`サイトの概要を作成しました: ${filePath}`);
  },
};
