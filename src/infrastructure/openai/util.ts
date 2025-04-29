import { ChatCompletionMessageParam } from "openai/resources/chat";

export function system(...args: string[]): ChatCompletionMessageParam {
  return createMessage("system", args.join("\n"));
}

export function user(...args: string[]): ChatCompletionMessageParam {
  return createMessage("user", args.join("\n"));
}

export function assistant(...args: string[]): ChatCompletionMessageParam {
  return createMessage("assistant", args.join("\n"));
}

export function createMessage(
  role: Extract<
    ChatCompletionMessageParam["role"],
    "user" | "assistant" | "system"
  >,
  ...args: string[]
): ChatCompletionMessageParam {
  return {
    role,
    content: args.join("\n"),
  };
}
