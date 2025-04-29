import { z } from "zod";

import { system, user } from "../../../infrastructure/openai/util";
import * as createCategories from "../tools/createCategories";
import { PromptBuilderResult } from "./types";

export function buildRootCategories(
  siteSummary: string,
  count: number,
): PromptBuilderResult<z.infer<typeof createCategories.argsSchema>> {
  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        system(
          `あなたは優れたブログ編集者です。出力は指定された関数を必ず使用してください。`,
        ),
        user(
          "以下の要件に従って、ルートカテゴリのリストを作成してください。",
          "# 要件",
          "- サイトの概要はMarkdown形式です。内容を理解してカテゴリを考えてください。",
          `## サイトの概要\n${siteSummary}`,
          `- 作成するカテゴリの数: ${count}個`,
          "- カテゴリは短い日本語単語で表現すること",
          "- 出力は必ず createCategories 関数を使用すること",
          "- カテゴリは一般的すぎず、サイトのテーマに沿った具体的なものにすること",
        ),
      ],
      tools: [createCategories.tool],
      tool_choice: "required",
    },
    createCategories.argsSchema,
  ];
}
