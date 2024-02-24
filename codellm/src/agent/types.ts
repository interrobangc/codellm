export type Agent = {
  chat: (message: string) => Promise<string>;
};
