import { z } from "zod";

import { CategorySchema } from "./schemas/category";
import { PageFrontMatterSchema, PageSchema } from "./schemas/page";
import { SectionPageSchema, SectionSchema } from "./schemas/section";

export type Page = z.infer<typeof PageSchema>;
export type PageFrontMatter = z.infer<typeof PageFrontMatterSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Section = z.infer<typeof SectionSchema>;
export type SectionPag = z.infer<typeof SectionPageSchema>;
