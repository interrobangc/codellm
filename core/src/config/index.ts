import type { Config, PartialConfig } from '@/.';

import get from 'lodash/get.js';
import merge from 'lodash/merge.js';
import log, { initLogger } from '@/log/index.js';
import { DEFAULTS, LLM_DEFAULTS, REQUIRED_KEYS } from './constants.js';

let config: Config;

// TODO: this should probably be done with zod.
export const validateConfig = (): void => {
  for (const key of REQUIRED_KEYS) {
    if (get(config, key) === undefined) {
      throw new Error(`Config key "${key}" is required`);
    }
  }
};

export const initConfig = (newConfig: PartialConfig) => {
  config = merge({}, DEFAULTS, newConfig) as Config;

  const llmDefaults =
    LLM_DEFAULTS[config.llmProvider as keyof typeof LLM_DEFAULTS] || {};

  config.llms = merge({}, llmDefaults, newConfig.llms) as Config['llms'];
  validateConfig();
  initLogger(config);

  log('Config set', 'debug', config);
};

export const getConfig = (): Config => {
  return config;
};

export default getConfig;

export * from './types.js';
export * from './constants.js';
