import { z } from "zod";

import { Category, Page } from "@/domain/types";
import { user } from "@/infrastructure/openai/util";

import { blogWriter } from "../messages/system";
import { argsSchema, tool } from "../tools/createPage";
import { PromptBuilderResult } from "./types";

export function buildGeneratePostPageInCoursePrompt(
  homePage: Page,
  categories: Category[],
  coursePage: Page,
  targetPage: Page,
): PromptBuilderResult<z.infer<typeof argsSchema>> {
  const categoryDescriptions = categories
    .map((c) => {
      return `- ${c.name}${c.description ? `: ${c.description}` : ""}`;
    })
    .join("\n");

  return [
    {
      model: "gpt-4",
      temperature: 0.7,
      messages: [
        blogWriter,
        user(
          "次の内容を下に概要まで作られている記事の内容を作成しなさい。",
          "サイト、カテゴリ、コースとして整合性を持たせなさい",
          "- 一つの記事の中で1000文字から2000文字程度の内容を生成しなさい",
          "- 見出し・段落の構成を維持しなさい",
          "# サイトの概要",
          homePage.body,
          "# カテゴリの構成",
          categoryDescriptions,
          "# コースページの概要",
          "この記事が含まれるコースの内容",
          coursePage.body,
          "# 現在の記事の内容",
          targetPage.body,
        ),
      ],
      tools: [tool],
      tool_choice: "required",
    },
    argsSchema,
  ];
}
