import type { Config } from '@/.';

import { CodeLlmError } from '@/error/index.js';

let config: Config;

export const setConfig = (newConfig: Config) => {
  config = newConfig;
};

export const getConfig = () => {
  if (!config) return new CodeLlmError({ code: 'config:NotInitialized' });
  return config;
};
