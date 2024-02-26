import type { Config } from '@interrobangc/codellm';
import _ from 'lodash';

import parseFile from './parseFile.js';
import { DEFAULTS, OPTION_NAMES } from './constants.js';

export const getConfig = (yargv: unknown): Partial<Config> => {
  // @ts-expect-error yargv typing isn't implemented yet
  const configFilePath = yargv.configFile || DEFAULTS.configFile;
  const configFile = parseFile(configFilePath) as Partial<Config>;
  const yConfig = _.pick(yargv, OPTION_NAMES) as Partial<Config>;
  const config: Partial<Config> = _.merge({}, DEFAULTS, configFile, yConfig);

  return config;
};

export default getConfig;
