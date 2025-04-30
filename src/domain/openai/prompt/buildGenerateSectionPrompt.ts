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
          `以下は静的サイトの全体概要です。\n\n`,
          `---\n${siteSummary}\n---\n\n`,
          `このサイト内のカテゴリ「${category}」${context} において、\n`,
          `「${keyword}」というテーマのセクションページを作成しようとしています。\n\n`,
          `以下のフォーマットに従って、1つのセクションを構造的に生成してください。\n\n`,
          `- name: セクションのタイトル（キャッチーかつわかりやすく）\n`,
          `- slug: URLに使用可能な英語のスラッグ（例: "react-hooks"）\n`,
          `- categories: セクションに関連するカテゴリ名の配列（例: ["React", "フロントエンド"]）\n`,
          `- description: セクション全体の紹介文（100〜200文字程度）\n`,
          `- pages: セクションに含まれる記事を4〜8件。各記事には次の情報を含めてください：\n`,
          `  - title: 記事タイトル\n`,
          `  - description: 記事概要（100文字以内）\n`,
          `  - slug: 英語のスラッグ\n`,
          `  - weight: 表示順に使う数値（小さいほど上に）\n`,
          `  - chapters: 記事内の小見出しとして4〜8件程度。それぞれに以下を含めてください：\n`,
          `    - title: 見出しタイトル\n`,
          `    - summary: その章で扱う内容を一言で（30〜50文字）\n\n`,
          `以下の情報は OpenAI の Function Calling で \`createSection\` に渡されます。\n`,
          `したがって、**1つの JSON オブジェクト形式で**出力してください（配列ではなく、1つのオブジェクト）。\n`,
          `複数のセクションを含めないでください。`,
        ),
      ],
      tools: [tool],
      tool_choice: "required",
    },
    argsSchema,
  ];
}
