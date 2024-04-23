import type { LogLevel, PartialConfig } from '@codellm/core';

import get from 'lodash/get';
import { remember } from '@epic-web/remember';

export type Auth0Config = {
  callbackURL: string;
  clientID: string;
  clientSecret: string;
  domain: string;
  logoutURL: string;
  secrets: string;
};

export type Config = {
  auth0: Auth0Config;
  codellm: PartialConfig;
};

let config: Config;

export const getCodellmConfig = () =>
  ({
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
        module: '@codellm/provider-anthropic',
      },
      langchain: {
        config: {
          chatClass: '',
          config: {},
          module: '',
        },
        module: '@codellm/provider-langchain',
      },
      mistral: {
        config: {
          apiKey: process.env.MISTRAL_API_KEY,
        },
        module: '@codellm/provider-mistral',
      },
      ollama: {
        config: {
          host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
        },
        module: '@codellm/provider-ollama',
      },
      openai: {
        config: {
          apiKey: process.env.OPENAI_API_KEY,
        },
        module: '@codellm/provider-openai',
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
      docSummaryQuery: {
        config: {
          vectorDbCollection: 'docSummary',
          vectorDbName: 'chromadb',
        },
        module: '@codellm/tool-doc-summary-query',
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
  }) as PartialConfig;

export const getAuth0Config = () =>
  ({
    callbackURL:
      process.env.AUTH0_CALLBACK_URL ?? 'http://localhost:3000/callback',
    clientID: process.env.AUTH0_CLIENT_ID ?? '',
    clientSecret: process.env.AUTH0_CLIENT_SECRET ?? '',
    domain: process.env.AUTH0_DOMAIN ?? '',
    logoutURL: process.env.AUTH0_LOGOUT_URL ?? '',
    secrets: process.env.AUTH0_SECRETS ?? '',
  }) as Auth0Config;

export const initConfig = () => {
  config = remember(
    'config',
    () =>
      ({
        auth0: getAuth0Config(),
        codellm: getCodellmConfig(),
      }) as Config,
  );
};

export const getConfig = (key: string | undefined) => {
  if (!config) {
    initConfig();
  }
  return key ? get(config, key) : config;
};
