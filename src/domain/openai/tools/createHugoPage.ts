import { ChatCompletionTool } from "openai/resources/index";
import { zodToJsonSchema } from "zod-to-json-schema";

import { HugoPageSchema } from "../../schemas/hugoPage";

const parameters = zodToJsonSchema(HugoPageSchema);

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createHugoPage",
    description: "Hugoのページを生成するための関数",
    parameters,
  },
};

export const argsSchema = HugoPageSchema;
