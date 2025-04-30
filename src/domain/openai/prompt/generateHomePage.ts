import { z } from "zod";

import { system, user } from "@/infrastructure/openai/util";

import * as createHugoPage from "../tools/createHugoPage";
import { PromptBuilderResult } from "./types";

export function buildGenerateHomePagePrompt(
  keyword: string,
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
          "以下の要件に従って、サイトのトップページ用の記事データを作成してください。",
          "# 要件",
          `- キーワード: ${keyword}`,
          "- Hugo用frontmatter（title, description）を生成すること",
          "- 本文（約1000文字）も生成すること",
          "- 本文はMarkdown形式で書くこと（コードブロックは不要）",
          "- 本文は今後の記事の方向性が分かるような内容にすること",
        ),
      ],
      tools: [createHugoPage.tool],
      tool_choice: "required",
    },
    createHugoPage.argsSchema,
  ];
}
