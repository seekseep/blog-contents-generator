import { select } from "@inquirer/prompts";

import { commands } from "../application/commands";
import { Command } from "../application/types";

export async function askCommand(): Promise<Command<any>> {
  return await select<Command<any>>({
    message: "コマンドを選択してください:",
    choices: commands.map((command) => ({
      name: command.name,
      value: command,
    })),
  });
}
