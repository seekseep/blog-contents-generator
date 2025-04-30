import { input } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateHomePagePrompt } from "@/domain/openai/prompt/generateHomePage";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import { Command } from "../types";
import { writePage } from "../util/page";

type GenerateHomePageParams = {
  keyword: string;
};

export const generateHomePageCommand: Command<GenerateHomePageParams> = {
  name: "サイトの概要を作成",
  description: "サイトの概要を作成します。",
  askParams: async () => {
    const keyword = await input({
      message: "サイトのキーワードを入力してください:",
      default: "プログラミング",
    });

    return { keyword };
  },
  execute: async ({ keyword }: GenerateHomePageParams) => {
    const [prompt, argsSchema] = buildGenerateHomePagePrompt(keyword);

    const spinner = ora("ホームページを作成中").start();
    const page = await callOpenAIFunction(prompt, argsSchema);
    spinner.stop();

    const filePath = writePage("_index", page);

    console.info(`サイトの概要を作成しました: ${filePath}`);
  },
};
