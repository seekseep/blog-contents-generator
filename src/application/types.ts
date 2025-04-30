export type Command = {
  name: string;
  description: string;
  execute: () => Promise<void>;
};
