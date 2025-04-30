import { z } from "zod";

import { user } from "@/infrastructure/openai/util";

import { blogWriter } from "../messages/system";
import { argsSchema, tool } from "../tools/createSection";
import { PromptBuilderResult } from "./types";

export function buildGenerateSectionPrompt(
  siteSummary: string,
  category: string,
  parentCategories: string[],
  keyword: string,
): PromptBuilderResult<z.infer<typeof argsSchema>> {
  const parentPath = parentCategories.join(" / ");
  const context =
    parentCategories.length > 0 ? `（上位カテゴリ: ${parentPath}）` : "";

  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        blogWriter,
        user(
          `以下は静的サイトの全体概要です。\n\n` +
            `---\n${siteSummary}\n---\n\n` +
            `このサイト内のカテゴリ「${category}」${context} において、\n` +
            `新たに「${keyword}」というテーマのセクションページを作成しようとしています。\n\n` +
            `このセクションページでは、以下の情報を含めてください：\n` +
            `- セクションタイトル（人が読んで理解しやすくキャッチーな見出し）\n` +
            `- 説明文（どんな内容を扱うセクションか、100〜200文字程度）\n` +
            `- Markdown 形式の本文（訪問者が概要を把握できるような導入文）\n\n` +
            `読者はこのテーマについて関心があるが、専門家ではない一般的なWebユーザーを想定してください。`,
        ),
      ],
      tools: [tool],
      tool_choice: "required",
    },
    argsSchema,
  ];
}
