import { ChatCompletionTool } from "openai/resources/index";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { CategorySchema } from "../../schemas/category";

const parameters = zodToJsonSchema(CategorySchema);

export const tool: ChatCompletionTool = {
  type: "function",
  function: {
    name: "createCategories",
    description: "カテゴリを作る関数",
    parameters: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: parameters,
          description: "作成するカテゴリの配列",
        },
      },
      required: ["categories"],
    },
  },
};

export const argsSchema = z.object({
  categories: z.array(CategorySchema),
});
