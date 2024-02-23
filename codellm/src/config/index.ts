import { CodeLlmConfig } from './types';

let config: CodeLlmConfig;

export const setConfig = (newConfig: CodeLlmConfig) => {
  config = newConfig;
}

export const getConfig = (): CodeLlmConfig => {
  return config;
}

export default getConfig;