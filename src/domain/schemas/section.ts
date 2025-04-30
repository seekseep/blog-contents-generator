import { z } from "zod";

export const SectionPageChapterSchema = z.object({
  title: z.string(),
  summary: z.string(),
});

export const SectionPageSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string(),
  weight: z.number().int(),
  chapters: z.array(SectionPageChapterSchema),
});

export const SectionSchema = z.object({
  name: z.string(),
  slug: z.string(),
  categories: z.array(z.string()),
  description: z.string(),
});
