export type CodeLlmClient = {
  initModel: () => Promise<void>;
  chat: (role: string, content: string) => Promise<string>;
};