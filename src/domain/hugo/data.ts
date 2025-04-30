import { z } from "zod";

export function parseDataOrElse<T>(
  data: string | null,
  schema: z.Schema<T>,
  defaultValue: T,
): T {
  if (!data) return defaultValue;
  try {
    const parsed = JSON.parse(data);
    return schema.parse(parsed);
  } catch (e) {
    console.error("Failed to parse data:", e);
    return defaultValue;
  }
}
