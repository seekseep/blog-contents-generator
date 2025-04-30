import { z } from "zod";

export const SectionPageOutlineSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  weight: z.number().int(),
});

export const SectionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
  pages: z.array(SectionPageOutlineSchema),
});
