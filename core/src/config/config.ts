import type { Config } from '@/.';

import { newError } from '@/error/index.js';

let config: Config;

export const setConfig = (newConfig: Config) => {
  config = newConfig;
};

export const getConfig = () => {
  if (!config) return newError({ code: 'config:NotInitialized' });
  return config;
};
