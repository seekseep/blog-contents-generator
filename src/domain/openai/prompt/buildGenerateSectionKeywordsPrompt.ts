import { z } from "zod";

import { Category } from "@/domain/types";
import { user } from "@/infrastructure/openai/util";

import { blogWriter } from "../messages/system";
import { argsSchema, tool } from "../tools/createKeywords";
import { PromptBuilderResult } from "./types";

export function buildGenerateSectionKeywordsPrompt(
  siteSummary: string,
  category: string,
  parentCategories: Category[],
): PromptBuilderResult<z.infer<typeof argsSchema>> {
  const parentPath = parentCategories.map((c) => c.name).join(" / ");
  const context =
    parentPath.length > 0 ? `（上位カテゴリ: ${parentPath}）` : "";

  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        blogWriter,
        user(
          `以下は静的サイトの全体概要です。\n\n`,
          `---\n${siteSummary}\n---\n\n`,
          `このサイト内のカテゴリ「${category}」${context} において、ユーザーが興味を持ちそうな小テーマやサブトピック（セクション候補）を考えてください。\n`,
          `それぞれのキーワードは、1つのセクションとして複数の記事を束ねられるような抽象度を持たせてください。`,
          `各ページの章についても考えてください。\n`,
          "タイトルと概要を作成してください。",
        ),
      ],
      tools: [tool],
      tool_choice: "required",
    },
    argsSchema,
  ];
}
