import type { Config, PartialConfig } from '@/.';

import get from 'lodash/get.js';
import merge from 'lodash/merge.js';
import { isError, newError } from '@/error/index.js';
import { initLogger, log } from '@/log/index.js';
import { DEFAULTS, LLM_DEFAULTS, REQUIRED_KEYS } from './constants.js';
import { setConfig } from './config.js';

// TODO: this should probably be done with zod.
export const validateConfig = (config: Config) => {
  const missing: string[] = [];
  for (const key of REQUIRED_KEYS) {
    if (get(config, key) === undefined) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    return newError({
      code: 'config:ValidationError',
      meta: { missing },
    });
  }

  return false;
};

export const initConfig = (newConfig: PartialConfig) => {
  const config = merge({}, DEFAULTS, newConfig) as Config;

  const llmDefaults =
    LLM_DEFAULTS[config.llmProvider as keyof typeof LLM_DEFAULTS] || {};

  config.llms = merge({}, llmDefaults, newConfig.llms) as Config['llms'];

  const validateRes = validateConfig(config);
  if (isError(validateRes)) return validateRes;

  const initLoggerRes = initLogger(config);
  if (isError(initLoggerRes)) return initLoggerRes;

  setConfig(config);
  log('Config set', 'debug', config);

  return config;
};
