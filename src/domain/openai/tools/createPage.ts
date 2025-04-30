import { ChatCompletionTool } from "openai/resources/index";
import { zodToJsonSchema } from "zod-to-json-schema";

import { PageSchema } from "../../schemas/page";

export const argsSchema = PageSchema;

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createPage",
    description: "ページを生成するための関数",
    parameters: zodToJsonSchema(argsSchema),
  },
};
