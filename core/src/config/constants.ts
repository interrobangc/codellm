import type { ErrorConsts } from '@/.';

/* eslint-disable sonarjs/no-duplicate-string */

export const CONFIG_ERRORS: ErrorConsts = {
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
      provider: 'anthropic',
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',
    },
    embedding: {
      provider: 'anthropic',
      model: 'davinci-codex',
    },
    summarize: {
      provider: 'anthropic',
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',
    },
    tool: {
      provider: 'anthropic',
      // model: 'claude-3-opus-20240229',
      model: 'claude-3-sonnet-20240229',
    },
  },
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
  logLevel: 'info',
  logFormat: 'cli',
  formatInUserMessage: true,
  llmProvider: 'ollama',
  providers: {
    anthropic: {
      module: '@codellm/provider-anthropic',
      config: {
        apiKey: '',
      },
    },
    mistral: {
      module: '@codellm/provider-mistral',
      config: {
        apiKey: '',
        endpoint: 'https://api.mistral.ai',
      },
    },
    ollama: {
      module: '@codellm/provider-ollama',
      config: {
        host: 'http://localhost:11434',
      },
    },
    openai: {
      module: '@codellm/provider-openai',
      config: {
        apiKey: '',
      },
    },
  },
  tools: {
    codeSummaryQuery: {
      module: '@codellm/tool-code-summary-query',
      config: {
        vectorDbName: 'chromadb',
      },
    },
  },

  vectorDbs: {
    chromadb: {
      module: '@codellm/vectordb-chromadb',
    },
  },
} as const;

/* eslint-enable sonarjs/no-duplicate-string */
