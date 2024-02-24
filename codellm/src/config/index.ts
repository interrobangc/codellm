import _ from 'lodash';
import { defaults } from './constants.js';
import { Config } from './types';

let config: Config;

export const setConfig = (newConfig: Config) => {
  config = _.merge({}, defaults, newConfig);
};

export const getConfig = (): Config => {
  return config;
};

export default getConfig;
