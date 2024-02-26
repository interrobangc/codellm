import _ from 'lodash';

import type { Config } from '@/.';

import log, { initLogger } from '@/log/index.js';
import { defaults } from './constants.js';

let config: Config;

export const initConfig = (newConfig: Config) => {
  config = _.merge({}, defaults, newConfig);

  initLogger(config);
  log('Config set', 'debug', config);
};

export const getConfig = (): Config => {
  return config;
};

export default getConfig;

export * from './types.js';
