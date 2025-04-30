import { ChatCompletionTool } from "openai/resources/index";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { KeywordSchema } from "@/domain/schemas/keyword";

export const argsSchema = z.object({
  keywords: z.array(KeywordSchema),
});

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createKeywords",
    description: "キーワードを作成する関数",
    parameters: zodToJsonSchema(argsSchema),
  },
};
