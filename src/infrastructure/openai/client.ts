import { OpenAI } from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index";
import { z } from "zod";

import { logRequest } from "./log";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callOpenAIFunction<T>(
  params: ChatCompletionCreateParamsNonStreaming,
  argsSchema: z.Schema<T>,
): Promise<T> {
  const response = await openai.chat.completions.create(params);
  const toolCalls = response.choices[0].message?.tool_calls ?? [];
  logRequest(params, response);
  if (toolCalls.length === 0) {
    throw new Error("Tool call result not found");
  }

  const rawArgs = JSON.parse(toolCalls[0].function.arguments || "{}");
  return argsSchema.parse(rawArgs);
}
