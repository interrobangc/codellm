import type {
  LogLevel,
  PartialConfig,
  ProviderModule,
  ToolModule,
} from '@codellm/core';

import * as providerAnthropic from '@codellm/provider-anthropic';
import * as providerLangchain from '@codellm/provider-langchain';
import * as providerMistral from '@codellm/provider-mistral';
import * as providerOllama from '@codellm/provider-ollama';
import * as providerOpenai from '@codellm/provider-openai';

const anthropic = providerAnthropic as ProviderModule;
const langchain = providerLangchain as ProviderModule;
const mistral = providerMistral as ProviderModule;
const ollama = providerOllama as ProviderModule;
// @ts-expect-error - not fighting with module types for now
const openai = providerOpenai as ProviderModule;

import * as toolCodeElementsQuery from '@codellm/tool-code-elements-query';
import * as toolCodeSummaryQuery from '@codellm/tool-code-summary-query';
import * as toolDocSummaryQuery from '@codellm/tool-doc-summary-query';
import * as toolFileReader from '@codellm/tool-file-reader';
import * as toolProjectGlob from '@codellm/tool-project-glob';

const codeElementsQuery = toolCodeElementsQuery as ToolModule;
const codeSummaryQuery = toolCodeSummaryQuery as ToolModule;
const docSummaryQuery = toolDocSummaryQuery as ToolModule;
const fileReader = toolFileReader as ToolModule;
const projectGlob = toolProjectGlob as ToolModule;

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

export type UserConfig = {
  userAutoLogin: boolean;
  userAutoVerify: boolean;
};

export type Config = {
  auth0: Auth0Config;
  codellm: PartialConfig;
  user: UserConfig;
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
        module: anthropic,
      },
      langchain: {
        config: {
          chatClass: '',
          config: {},
          module: '',
        },
        module: langchain,
      },
      mistral: {
        config: {
          apiKey: process.env.MISTRAL_API_KEY,
        },
        module: mistral,
      },
      ollama: {
        config: {
          host: process.env.OLLAMA_HOST ?? 'http://localhost:11434',
        },
        module: ollama,
      },
      openai: {
        config: {
          apiKey: process.env.OPENAI_API_KEY,
        },
        module: openai,
      },
    },
    tools: {
      codeElementsQuery: {
        config: {
          vectorDbCollection: 'codeElements',
          vectorDbName: 'chromadb',
        },
        module: codeElementsQuery,
      },
      codeSummaryQuery: {
        config: {
          vectorDbCollection: 'codeSummary',
          vectorDbName: 'chromadb',
        },
        module: codeSummaryQuery,
      },
      docSummaryQuery: {
        config: {
          vectorDbCollection: 'docSummary',
          vectorDbName: 'chromadb',
        },
        module: docSummaryQuery,
      },
      fileReader: {
        config: {
          maxFileCount: 10,
        },
        module: fileReader,
      },
      projectGlob: {
        module: projectGlob,
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

export const getUserConfig = () => ({
  userAutoLogin: process.env.USER_AUTO_LOGIN === 'true',
  userAutoVerify: process.env.USER_AUTO_VERIFY === 'true',
});

export const initConfig = () => {
  config = remember(
    'config',
    () =>
      ({
        auth0: getAuth0Config(),
        codellm: getCodellmConfig(),
        user: getUserConfig(),
      }) as Config,
  );
  console.dir(config, { depth: null });
};

export const getConfig = (key: string | undefined) => {
  if (!config) {
    initConfig();
  }
  return key ? get(config, key) : config;
};
