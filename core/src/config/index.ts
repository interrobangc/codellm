import type { Config, PartialConfig } from '@/.';

import get from 'lodash/get.js';
import merge from 'lodash/merge.js';
import { CodeLlmError, isError } from '@/error/index.js';
import log, { initLogger } from '@/log/index.js';
import { DEFAULTS, LLM_DEFAULTS, REQUIRED_KEYS } from './constants.js';

let config: Config;

// TODO: this should probably be done with zod.
export const validateConfig = () => {
  const missing: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (get(config, key) === undefined) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    return new CodeLlmError({
      code: 'config:ValidationError',
      meta: { missing },
    });
  }

  return false;
};

export const initConfig = (newConfig: PartialConfig) => {
  config = merge({}, DEFAULTS, newConfig) as Config;

  const llmDefaults =
    LLM_DEFAULTS[config.llmProvider as keyof typeof LLM_DEFAULTS] || {};

  config.llms = merge({}, llmDefaults, newConfig.llms) as Config['llms'];

  const validateRes = validateConfig();
  if (isError(validateRes)) {
    return validateRes;
  }

  const initLoggerRes = initLogger(config);
  if (isError(initLoggerRes)) {
    return initLoggerRes;
  }

  log('Config set', 'debug', config);

  return false;
};

export const getConfig = (): Config => {
  return config;
};

export default getConfig;

export * from './types.js';
export * from './constants.js';
