import fs from "fs";
import OpenAI from "openai";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/index";
import path from "path";

export function logRequest(
  params: ChatCompletionCreateParamsNonStreaming,
  response: OpenAI.Chat.Completions.ChatCompletion,
) {
  const requestId = response.id;
  const dirname = path.resolve("logs/openai");
  const parameters = JSON.stringify(params, null, 2);
  const responseData = JSON.stringify(response, null, 2);
  const requestDir = path.join(dirname, requestId);
  const requestFilePath = path.join(requestDir, `request.json`);
  const responseFilePath = path.join(requestDir, `response.json`);

  fs.mkdirSync(requestDir, { recursive: true });
  fs.writeFileSync(requestFilePath, parameters);
  fs.writeFileSync(responseFilePath, responseData);
}
