import type { LogLevel, PartialConfig, ProviderModule } from '@codellm/core';

export const getConfig = async (): Promise<PartialConfig> => ({
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
      module: (await import(
        '@codellm/provider-anthropic'
      )) as unknown as ProviderModule,
    },
    langchain: {
      config: {
        chatClass: '',
        config: {},
        module: '',
      },
      module: (await import(
        '@codellm/provider-langchain'
      )) as unknown as ProviderModule,
    },
    mistral: {
      config: {
        apiKey: process.env.MISTRAL_API_KEY,
      },
      module: (await import(
        '@codellm/provider-mistral'
      )) as unknown as ProviderModule,
    },
    ollama: {
      config: {
        host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
      },
      module: (await import(
        '@codellm/provider-ollama'
      )) as unknown as ProviderModule,
    },
    openai: {
      config: {
        apiKey: process.env.OPENAI_API_KEY,
      },
      module: (await import(
        '@codellm/provider-openai'
      )) as unknown as ProviderModule,
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
});
