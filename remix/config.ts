import type { LogLevel, PartialConfig } from '@codellm/core';

const config: PartialConfig = {
  formatInUserMessage: true,
  llmProvider: process.env.CODELLM_PROVIDER ?? 'ollama',
  logLevel: (process.env.CODELLM_LOG_LEVEL as LogLevel) ?? 'info',
  paths: {
    cache: '../.cache',
    project: '..',
  },
  project: {
    name: 'CodeLlm',
  },
  providers: {
    anthropic: {
      config: {
        apiKey: process.env.ANTHROPIC_API_KEY,
      },
    },
    mistral: {
      config: {
        apiKey: process.env.MISTRAL_API_KEY,
      },
    },
    ollama: {
      config: {
        host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
      },
    },
    openai: {
      config: {
        apiKey: process.env.OPENAI_API_KEY,
      },
    },
  },
  tools: {
    codeElementsQuery: {
      config: {
        vectorDbCollection: 'codeElements',
        vectorDbName: 'chromadb',
      },
      module: '@codellm/tool-code-elements-query',
    },
    codeSummaryQuery: {
      config: {
        vectorDbCollection: 'codeSummary',
        vectorDbName: 'chromadb',
      },
      module: '@codellm/tool-code-summary-query',
    },
    fileReader: {
      config: {
        maxFileCount: 10,
      },
      module: '@codellm/tool-file-reader',
    },
    projectGlob: {
      module: '@codellm/tool-project-glob',
    },
  },
};

export default config;
