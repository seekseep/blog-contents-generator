import { ChatCompletionTool } from "openai/resources/index";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { CategorySchema } from "../../schemas/category";

export const argsSchema = z.object({
  categories: z.array(CategorySchema),
});

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createCategories",
    description: "カテゴリを作る関数",
    parameters: zodToJsonSchema(argsSchema),
  },
};
