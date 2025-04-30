import { z } from "zod";

import { Category } from "@/domain/types";
import { user } from "@/infrastructure/openai/util";

import { blogWriter } from "../messages/system";
import * as createCategories from "../tools/createCategories";
import { PromptBuilderResult } from "./types";

export function buildGenerateSubCategoriesPrompt(
  siteSummary: string,
  parentCategory: Category,
  count: number,
): PromptBuilderResult<z.infer<typeof createCategories.argsSchema>> {
  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        blogWriter,
        user(
          "以下の要件に従って、小カテゴリ（サブカテゴリ）のリストを作成してください。",
          "# 要件",
          `- サイトの概要はMarkdown形式です。内容を理解してカテゴリを考えてください。`,
          `## サイトの概要\n${siteSummary}`,
          `- 親カテゴリ: ${parentCategory.name}`,
          `- 作成する小カテゴリの数: ${count}個`,
          "- 小カテゴリは短い日本語単語で表現すること",
          "- 小カテゴリは親カテゴリのテーマを細かく分類するものにすること",
          "- 出力は必ず createCategories 関数を使用すること",
          "- 通常の文章や説明文を書かないこと。ツール呼び出しのみを行うこと。",
        ),
      ],
      tools: [createCategories.tool],
      tool_choice: "required",
    },
    createCategories.argsSchema,
  ];
}
