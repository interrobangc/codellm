export type CodeLlmAgent = {
  chat: (message: string) => Promise<string>
}
