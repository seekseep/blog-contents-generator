import { checkbox, input, select } from "@inquirer/prompts";
import ora from "ora";

import { buildGenerateSectionKeywordsPrompt } from "@/domain/openai/prompt/buildGenerateSectionKeywordsPrompt";
import { buildGenerateSectionPrompt } from "@/domain/openai/prompt/buildGenerateSectionPrompt";
import { createCategoryPathGetter } from "@/domain/site";
import { callOpenAIFunction } from "@/infrastructure/openai/client";

import ApplicationError from "../errors/ApplicationError";
import { Command } from "../types";
import { readCategories } from "../util/category";
import { readPage } from "../util/page";
import { writeSectionPage } from "../util/section";

export const generateSectionsPagesCommand: Command = {
  name: "セクションの作成",
  description: "指定したカテゴリに対してセクションを作成する",
  execute: async () => {
    const allCategories = readCategories();
    const getCategoryPath = createCategoryPathGetter(allCategories);

    const category = await select({
      message: "セクションを作成するカテゴリを選択してください:",
      choices: allCategories
        .map((category) => {
          const path = getCategoryPath(category)
            .map((c) => c.name)
            .join(" / ");
          return {
            name: path,
            value: category,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    });

    const homePage = readPage("_index");
    if (!homePage) throw new ApplicationError("Home page not found");

    const parentCategories = getCategoryPath(category).slice(0, -1);

    // --- キーワードの生成 ---
    const keywords: string[] = [];

    const inputKeywordMethod = await select({
      message: "キーワードの生成方法を選択してください:",
      choices: [
        { name: "キーワードを自動生成する", value: "auto" },
        { name: "キーワードを手動で入力する", value: "manual" },
      ],
      default: "manual",
    });

    if (inputKeywordMethod === "manual") {
      let finished = false;
      while (!finished) {
        const keyword = await input({
          message: "キーワードを入力してください:",
        });

        keywords.push(keyword);

        finished = !(await select({
          message: "キーワードを追加しますか？",
          choices: [
            { name: "はい", value: true },
            { name: "いいえ", value: false },
          ],
          default: false,
        }));
      }
    }

    if (inputKeywordMethod === "auto") {
      const keywordSpinner = ora("キーワードを生成中...").start();
      const result = await callOpenAIFunction(
        ...buildGenerateSectionKeywordsPrompt(
          homePage.body,
          category.name,
          parentCategories,
        ),
      );
      keywordSpinner.stop();

      keywords.push(...result.keywords.map((keyword) => keyword.word));
    }

    // --- キーワードの選択 ---
    const selected: string[] = [];

    if (inputKeywordMethod === "manual") {
      selected.push(...keywords);
    } else {
      selected.push(
        ...(await checkbox({
          message: "作成するセクションを選んでください:",
          choices: keywords.map((keywords) => ({
            name: keywords,
            value: keywords,
          })),
        })),
      );
    }

    // --- セクションの生成 ---
    for (const keyword of selected) {
      const sectionSpinner = ora(`「${keyword}」を生成中...`).start();
      const result = await callOpenAIFunction(
        ...buildGenerateSectionPrompt(
          homePage.body,
          category.name,
          parentCategories.map((c) => c.name),
          keyword,
        ),
      );
      sectionSpinner.stop();

      const filePaths = await writeSectionPage(result.section, result.pages);
      console.info(`✅ セクション「${keyword}」を作成しました`);
      for (const filePath of filePaths) {
        console.info(`   ${filePath}`);
      }
    }
  },
};
