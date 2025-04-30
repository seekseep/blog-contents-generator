import { input } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateHomePagePrompt } from "@/domain/openai/prompt/buildGenerateHomePagePrompt";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import { Command } from "../types";
import { writePage } from "../util/page";

export const generateHomePageCommand: Command = {
  name: "サイトの概要を作成",
  description: "サイトの概要を作成します。",
  execute: async () => {
    const keyword = await input({
      message: "サイトのキーワードを入力してください:",
      default: "プログラミング",
    });

    const spinner = ora("ホームページを作成中").start();
    const page = await callOpenAIFunction(
      ...buildGenerateHomePagePrompt(keyword),
    );
    spinner.stop();

    const filePath = writePage("_index", page);

    console.info(`サイトの概要を作成しました: ${filePath}`);
  },
};
