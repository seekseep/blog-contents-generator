import { z } from "zod";

export const PageFrontMatterSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  slug: z.string().optional(),
  type: z.string().optional(),
  weight: z.number().optional(),
  author: z.string().optional(),
  bodyGenerateRequired: z.boolean().optional(),
});

export const PageSchema = z.object({
  frontmatter: PageFrontMatterSchema,
  body: z.string(),
});
