import { CodeLlmClient } from '../llm/types.js'

export type CodeLlmAgent = {
  chat: (message: string) => Promise<string>
}

export type CodeLlmLlms = Record<string, CodeLlmClient>