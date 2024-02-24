import { CodeLlmConfig } from './types.js';

export const defaults: CodeLlmConfig = {
  debugLevel: 'debug',
  llms: {
    embedding: {
      provider: 'ollama',
      model: 'nomic-embed-text'
    },
    toolSelection: {
      provider: 'ollama',
      model: 'mixtral:8x7b'
    },
    agent: {
      provider: 'ollama',
      model: 'mixtral:8x7b'
    },
  }
}