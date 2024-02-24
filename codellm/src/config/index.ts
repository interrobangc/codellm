import _ from 'lodash'
import { defaults } from './constants.js';
import { CodeLlmConfig } from './types';

let config: CodeLlmConfig;

export const setConfig = (newConfig: CodeLlmConfig) => {
  config = _.merge({}, defaults, newConfig);
}

export const getConfig = (): CodeLlmConfig => {
  return config;
}

export default getConfig;