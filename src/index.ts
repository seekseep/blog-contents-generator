import "dotenv/config";

import { ExitPromptError } from "@inquirer/core";

import { start } from "./cli";

async function main() {
  try {
    await start(); // ←ここが重要
  } catch (error) {
    if (error instanceof ExitPromptError) {
      console.info("操作がキャンセルされました。");
    } else {
      console.error("エラーが発生しました:", error);
    }
    process.exit(1); // 明示的に異常終了するのもいい
  }
}

main();
