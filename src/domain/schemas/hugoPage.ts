import { z } from "zod";

import { HugoFrontMatterSchema } from "./hugoFrontMatter";

export const HugoPageSchema = z.object({
  frontmatter: HugoFrontMatterSchema,
  body: z.string(),
});
