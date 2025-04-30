import { z } from "zod";

import { Category } from "@/domain/types";
import { system, user } from "@/infrastructure/openai/util";

import * as createHugoPage from "../tools/createHugoPage";
import { PromptBuilderResult } from "./types";

export function generateCategoryPagePrompt(
  category: Category,
  siteSummary: string,
  parentCategories: Category[],
): PromptBuilderResult<z.infer<typeof createHugoPage.argsSchema>> {
  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        system(
          `あなたは優れたブログ編集者です。出力は指定された関数を必ず使用してください。`,
        ),
        user(
          `以下の情報をもとに、Hugo 用のカテゴリページを作成してください。\n\n` +
            `## サイト全体の概要\n${siteSummary}\n\n` +
            `## 対象カテゴリ\n- 名前: ${category.name}\n- 説明: ${category.description}\n\n` +
            (parentCategories.length > 0
              ? `## 親カテゴリ\n` +
                parentCategories
                  .map(
                    (p, i) => `- レベル${i + 1}: ${p.name}（${p.description}）`,
                  )
                  .join("\n") +
                "\n\n"
              : "") +
            `カテゴリページとしてふさわしいタイトル、本文、メタ情報（タイトル・説明）を生成し、指定された関数で出力してください。`,
        ),
      ],
      tools: [createHugoPage.tool],
      tool_choice: "required",
    },
    createHugoPage.argsSchema,
  ];
}
