import merge from 'lodash/merge.js';

import type { Config, PartialConfig } from '@/.';

import log, { initLogger } from '@/log/index.js';
import { DEFAULTS, LLM_DEFAULTS } from './constants.js';

let config: Config;

export const initConfig = (newConfig: PartialConfig) => {
  config = merge({}, DEFAULTS, newConfig) as Config;

  config.llms = merge(
    {},
    LLM_DEFAULTS[config.llmProvider],
    newConfig.llms,
  ) as Config['llms'];

  initLogger(config);
  log('Config set', 'debug', config);
};

export const getConfig = (): Config => {
  return config;
};

export default getConfig;

export * from './types.js';
export * from './constants.js';
