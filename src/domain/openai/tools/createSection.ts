import { ChatCompletionTool } from "openai/resources/index";
import { zodToJsonSchema } from "zod-to-json-schema";

import { SectionSchema } from "../../schemas/section";

export const argsSchema = SectionSchema;

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createSection",
    description: "セクションを作る関数",
    parameters: zodToJsonSchema(argsSchema),
  },
};
