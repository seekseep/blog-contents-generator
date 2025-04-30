import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  parentName: z.string().optional(),
  slug: z.string().optional(),
});
