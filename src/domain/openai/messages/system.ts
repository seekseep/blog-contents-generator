import { system } from "@/infrastructure/openai/util";

export const blogWriter = system(
  "あなたは優れた技術ブログの編集者です。出力は指定された関数を必ず使用してください。",
);
