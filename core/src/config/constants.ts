/* eslint-disable sonarjs/no-duplicate-string */

export const CONFIG_ERRORS = {
  'config:ValidationError': {
    message: 'Config validation error',
  },
} as const;

export const REQUIRED_PATHS = ['cache', 'project'] as const;

export const REQUIRED_KEYS = [
  ...REQUIRED_PATHS.map((path) => `paths.${path}`),
  'project.name',
];

export const SERVICES_TYPE = {
  agent: 'agent',
  embedding: 'embedding',
  summarize: 'summarize',
  tool: 'tool',
} as const;

export const SERVICES = Object.values(SERVICES_TYPE);

export const LLM_DEFAULTS = {
  anthropic: {
    agent: {
      model: 'claude-3-opus-20240229',
      // model: 'claude-3-sonnet-20240229',

      provider: 'anthropic',
    },
    embedding: {
      model: 'davinci-codex',
      provider: 'anthropic',
    },
    summarize: {
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',

      provider: 'anthropic',
    },
    tool: {
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',

      provider: 'anthropic',
    },
  },
  mistral: {
    agent: {
      model: 'mistral-large-latest',
      provider: 'mistral',
    },
    embedding: {
      model: 'mistral-embed',
      provider: 'mistral',
    },
    summarize: {
      model: 'open-mixtral-8x7b',
      provider: 'mistral',
    },
    tool: {
      model: 'open-mixtral-8x7b',
      provider: 'mistral',
    },
  },
  ollama: {
    agent: {
      model: 'mixtral:8x7b',
      provider: 'ollama',
    },
    embedding: {
      model: 'nomic-embed-text',
      provider: 'ollama',
    },
    summarize: {
      model: 'mixtral:8x7b',
      provider: 'ollama',
    },
    tool: {
      model: 'mixtral:8x7b',
      provider: 'ollama',
    },
  },
  openai: {
    agent: {
      model: 'gpt-4-turbo-preview',
      provider: 'openai',
    },
    embedding: {
      model: 'text-davinci-003',
      provider: 'openai',
    },
    summarize: {
      model: 'gpt-4-turbo-preview',
      provider: 'openai',
    },
    tool: {
      model: 'gpt-4-turbo-preview',
      provider: 'openai',
    },
  },
} as const;

export const DEFAULTS = {
  formatInUserMessage: true,
  llmProvider: 'ollama',
  logFormat: 'cli',
  logLevel: 'info',
  providers: {
    anthropic: {
      config: {
        apiKey: '',
      },
      module: '@codellm/provider-anthropic',
    },
    mistral: {
      config: {
        apiKey: '',
        endpoint: 'https://api.mistral.ai',
      },
      module: '@codellm/provider-mistral',
    },
    ollama: {
      config: {
        host: 'http://localhost:11434',
      },
      module: '@codellm/provider-ollama',
    },
    openai: {
      config: {
        apiKey: '',
      },
      module: '@codellm/provider-openai',
    },
  },
  shouldThrow: false,
  vectorDbs: {
    chromadb: {
      module: '@codellm/vectordb-chromadb',
    },
  },
} as const;

/* eslint-enable sonarjs/no-duplicate-string */
