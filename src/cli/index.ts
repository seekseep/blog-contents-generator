import ApplicationError from "../application/errors/ApplicationError";
import { askCommand } from "./command";

export async function start() {
  console.info("📚 Markdown記事ジェネレーターへようこそ！");
  let finished = false;
  while (!finished) {
    try {
      const command = await askCommand();
      const params = await command.askParams();
      await command.execute(params);
    } catch (error) {
      if (error instanceof ApplicationError) {
        console.error("アプリケーションエラー:", error.message);
      } else {
        throw error;
      }
    }
  }
}
