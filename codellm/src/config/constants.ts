/* eslint-disable sonarjs/no-duplicate-string */

import type { Config } from '@/.';

export const defaults: Config = {
  path: '..',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  logLevel: 'info',
  logFormat: 'cli',
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
    tool: {
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
  vectorDb: 'chromadb',
};

/* eslint-enable sonarjs/no-duplicate-string */
