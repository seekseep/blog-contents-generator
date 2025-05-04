import { select } from "@inquirer/prompts";

import { commands } from "../application/commands";
import { Command } from "../application/types";

export async function askCommand(): Promise<Command> {
  return await select<Command>({
    message: "コマンドを選択してください:",
    choices: commands.map((command) => ({
      name: command.name,
      value: command,
    })),
  });
}
