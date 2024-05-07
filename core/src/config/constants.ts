/* eslint-disable sonarjs/no-duplicate-string */

export const CONFIG_ERRORS = {
  'config:NotInitialized': {
    message: 'Config not initialized',
  },
  'config:ValidationError': {
    message: 'Config validation error',
  },
} as const;

export const REQUIRED_PATHS = ['cache', 'project'] as const;

export const REQUIRED_KEYS = [
  ...REQUIRED_PATHS.map((path) => `paths.${path}`),
  'project.name',
];

export const LLM_DEFAULTS = {
  anthropic: {
    chat: {
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',
      provider: 'anthropic',
    },
    embedding: {
      model: 'davinci-codex',
      provider: 'anthropic',
    },
  },
  mistral: {
    chat: {
      model: 'mistral-large-latest',
      provider: 'mistral',
    },
    embedding: {
      model: 'mistral-embed',
      provider: 'mistral',
    },
  },
  ollama: {
    chat: {
      model: 'llama3',
      provider: 'ollama',
    },
    embedding: {
      model: 'nomic-embed-text',
      provider: 'ollama',
    },
  },
  openai: {
    chat: {
      model: 'gpt-4-turbo-preview',
      provider: 'openai',
    },
    embedding: {
      model: 'text-davinci-003',
      provider: 'openai',
    },
  },
} as const;

export const DEFAULTS = {
  formatInUserMessage: true,
  llmProvider: 'ollama',
  logFormat: 'cli',
  logLevel: 'info',
  shouldImportAsync: true,
  shouldThrow: false,
  vectorDbs: {
    chromadb: {
      module: '@codellm/vectordb-chromadb',
    },
  },
};

/* eslint-enable sonarjs/no-duplicate-string */
