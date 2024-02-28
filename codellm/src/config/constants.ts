/* eslint-disable sonarjs/no-duplicate-string */

export const SERVICES_TYPE = {
  agent: 'agent',
  embedding: 'embedding',
  summarize: 'summarize',
  tool: 'tool',
} as const;

export const SERVICES = Object.values(SERVICES_TYPE);

export const LLM_DEFAULTS = {
  mistral: {
    agent: {
      provider: 'mistral',
      model: 'mistral-large-latest',
    },
    embedding: {
      provider: 'mistral',
      model: 'mistral-embed',
    },
    summarize: {
      provider: 'mistral',
      model: 'open-mixtral-8x7b',
    },
    tool: {
      provider: 'mistral',
      model: 'open-mixtral-8x7b',
    },
  },
  ollama: {
    agent: {
      provider: 'ollama',
      model: 'mixtral:8x7b',
    },
    embedding: {
      provider: 'ollama',
      model: 'nomic-embed-text',
    },
    summarize: {
      provider: 'ollama',
      model: 'mixtral:8x7b',
    },
    tool: {
      provider: 'ollama',
      model: 'mixtral:8x7b',
    },
  },
  openai: {
    agent: {
      provider: 'openai',
      model: 'gpt-4-turbo-preview',
    },
    embedding: {
      provider: 'openai',
      model: 'text-davinci-003',
    },
    summarize: {
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
  logLevel: 'info',
  logFormat: 'cli',
  llmProvider: 'ollama',
  providers: {
    mistral: {
      apiKey: '',
    },
    ollama: {
      host: 'http://localhost:11434',
    },
    openai: {
      apiKey: '',
    },
  },
  tools: [
    {
      name: 'codeSummaryQuery',
      module: '@interrobangc/codellm-tool-code-summary-query',
    },
  ],

  vectorDb: 'chromadb',
} as const;

/* eslint-enable sonarjs/no-duplicate-string */
