export type Command<CommandParameter = void> = {
  name: string;
  description: string;
  execute: (params: CommandParameter) => Promise<void>;
  askParams: () => Promise<CommandParameter>;
};
