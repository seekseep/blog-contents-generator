import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat";
import { z } from "zod";

export type PromptBuilderResult<T> = [
  prompt: ChatCompletionCreateParamsNonStreaming,
  argsSchema: z.ZodType<T>,
];
