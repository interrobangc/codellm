import type { ProviderConfigs, ProviderModule } from '@codellm/core';

import * as anthropic from '@codellm/provider-anthropic';
import * as langchain from '@codellm/provider-langchain';
import * as mistral from '@codellm/provider-mistral';
import * as ollama from '@codellm/provider-ollama';
import * as openai from '@codellm/provider-openai';

export const DEFAULTS = {
  configFile: './config.yml',
} as const;

export const OPTIONS = {
  configFile: {
    alias: 'c',
    default: process.env['CODELLM_CONFIG_FILE'],
    description: 'Path to the config file',
    type: 'string',
  },
  llmProvider: {
    alias: 'lp',
    default: process.env['CODELLM_PROVIDER'],
    description: 'LLM provider',
    options: ['ollama', 'openai'],
    type: 'string',
  },
  logLevel: {
    alias: 'l',
    default: process.env['CODELLM_LOG_LEVEL'],
    description: 'Log level',
    options: ['error', 'warn', 'info', 'verbose', 'debug', 'silly'],
    type: 'string',
  },
  'project.name': {
    alias: 'n',
    default: process.env['CODELLM_PROJECT_NAME'],
    description: 'Name of the project',
    type: 'string',
  },
  'project.path': {
    alias: 'p',
    default: process.env['CODELLM_PROJECT_PATH'],
    description: 'Path to search',
    type: 'string',
  },
  'providers.anthropic.config.apiKey': {
    default: process.env['ANTHROPIC_API_KEY'],
    description: 'Anthropic API key',
    type: 'string',
  },
  'providers.mistral.config.apiKey': {
    default: process.env['MISTRAL_API_KEY'],
    description: 'Mistral API key',
    type: 'string',
  },
  'providers.openai.config.apiKey': {
    default: process.env['OPENAI_API_KEY'],
    description: 'OpenAI API key',
    type: 'string',
  },
} as const;

export const PROVIDERS: ProviderConfigs = {
  anthropic: {
    config: {
      apiKey: '',
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
      apiKey: '',
    },
    module: mistral as unknown as ProviderModule,
  },
  ollama: {
    config: {
      host: 'http://localhost:11434',
    },
    module: ollama as unknown as ProviderModule,
  },
  openai: {
    config: {
      apiKey: '',
    },
    module: openai as unknown as ProviderModule,
  },
} as const;

export const OPTION_NAMES = Object.keys(OPTIONS);
