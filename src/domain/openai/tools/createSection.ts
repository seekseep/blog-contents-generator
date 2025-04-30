import { ChatCompletionTool } from "openai/resources/index";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { SectionPageSchema, SectionSchema } from "../../schemas/section";

export const argsSchema = z.object({
  section: SectionSchema,
  pages: z.array(SectionPageSchema),
});

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createSection",
    description: "セクションを作る関数",
    parameters: zodToJsonSchema(argsSchema),
  },
};

console.log("tool", JSON.stringify(tool, null, 2));
