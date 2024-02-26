import _ from 'lodash';

import type { Config } from '@/.';

import log, { initLogger } from '@/log/index.js';
import { DEFAULTS, LLM_DEFAULTS } from './constants.js';

let config: Config;

export const initConfig = (newConfig: Partial<Config>) => {
  config = _.merge({}, DEFAULTS, newConfig) as Config;

  config.llms = _.merge(
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
