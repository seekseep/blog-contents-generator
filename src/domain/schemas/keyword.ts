import { z } from "zod";

export const KeywordSchema = z.object({
  word: z.string(),
});
