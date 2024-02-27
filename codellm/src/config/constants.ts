/* eslint-disable sonarjs/no-duplicate-string */

export const SERVICES_TYPE = {
  agent: 'agent',
  embedding: 'embedding',
  summarize: 'summarize',
  tool: 'tool',
} as const;

export const SERVICES = Object.values(SERVICES_TYPE);

export const LLM_DEFAULTS = {
  ollama: {
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
  openai: {
    embedding: {
      provider: 'openai',
      model: 'text-davinci-003',
    },
    summarize: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
    },
    agent: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
    },
    tool: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
    },
  },
} as const;

export const DEFAULTS = {
  path: '..',
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  logLevel: 'info',
  logFormat: 'cli',
  llmProvider: 'ollama',
  providers: {
    ollama: {
      host: 'http://localhost:11434',
    },
    openai: {
      apiKey: '',
    },
  },
  vectorDb: 'chromadb',
} as const;

/* eslint-enable sonarjs/no-duplicate-string */
