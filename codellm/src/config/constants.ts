import { Config } from './types';

export const defaults: Config = {
  path: '..',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  debugLevel: 'debug',
  llms: {
    embedding: {
      provider: 'ollama',
      model: 'nomic-embed-text',
    },
    summarize: {
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
