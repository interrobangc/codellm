import type { LogLevel, PartialConfig, ProviderModule } from '@codellm/core';
import * as anthropic from '@codellm/provider-anthropic';
import * as langchain from '@codellm/provider-langchain';
import * as mistral from '@codellm/provider-mistral';
import * as ollama from '@codellm/provider-ollama';
import * as openai from '@codellm/provider-openai';

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
      module: anthropic as unknown as ProviderModule,
    },
    langchain: {
      config: {
        chatClass: '',
        config: {},
        module: '',
      },
      module: langchain as unknown as ProviderModule,
    },
    mistral: {
      config: {
        apiKey: process.env.MISTRAL_API_KEY,
      },
      module: mistral as unknown as ProviderModule,
    },
    ollama: {
      config: {
        host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
      },
      module: ollama as unknown as ProviderModule,
    },
    openai: {
      config: {
        apiKey: process.env.OPENAI_API_KEY,
      },
      module: openai as unknown as ProviderModule,
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
