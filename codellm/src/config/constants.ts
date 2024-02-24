import { Config } from './types';

export const defaults: Config = {
  debugLevel: 'debug',
  llms: {
    embedding: {
      provider: 'ollama',
      model: 'nomic-embed-text',
    },
    summarization: {
      provider: 'ollama',
      model: 'mixtral:8x7b',
    },
    agent: {
      provider: 'ollama',
      model: 'mixtral:8x7b',
    },
  },
  providers: {
    ollama: {
      host: 'http://localhost:11434',
    },
    openai: {
      apiKey: '',
    },
  },
};
