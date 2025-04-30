import { Page } from "@domain/types";

export type Command = {
  name: string;
  description: string;
  execute: () => Promise<void>;
};

export type PageWithIndex = {
  page: Page;
  index: Page;
};
