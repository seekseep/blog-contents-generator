import { z } from "zod";

import { CategorySchema } from "./schemas/category";
import { HugoFrontMatterSchema } from "./schemas/hugoFrontMatter";
import { HugoPageSchema } from "./schemas/hugoPage";

export type HugoPage = z.infer<typeof HugoPageSchema>;
export type HugoFrontMatter = z.infer<typeof HugoFrontMatterSchema>;
export type Category = z.infer<typeof CategorySchema>;
