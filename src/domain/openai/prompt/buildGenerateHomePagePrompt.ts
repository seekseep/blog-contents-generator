import { z } from "zod";

import { user } from "@/infrastructure/openai/util";

import { blogWriter } from "../messages/system";
import { argsSchema, tool } from "../tools/createPage";
import { PromptBuilderResult } from "./types";

export function buildGenerateHomePagePrompt(
  keyword: string,
): PromptBuilderResult<z.infer<typeof argsSchema>> {
  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        blogWriter,
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
      tools: [tool],
      tool_choice: "required",
    },
    argsSchema,
  ];
}
