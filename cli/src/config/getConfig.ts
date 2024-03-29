import type { PartialConfig } from '@codellm/core';
import pick from 'lodash/pick.js';
import merge from 'lodash/merge.js';

import parseFile from './parseFile.js';
import { DEFAULTS, OPTION_NAMES, PROVIDERS } from './constants.js';

export const getConfig = (yargv: unknown): PartialConfig => {
  // @ts-expect-error yargv typing isn't implemented yet
  const configFilePath = yargv.configFile || DEFAULTS.configFile;
  const configFile = parseFile(configFilePath) as PartialConfig;
  const yConfig = pick(yargv, OPTION_NAMES) as PartialConfig;
  const config: PartialConfig = merge({}, DEFAULTS, configFile, yConfig);

  config.providers = PROVIDERS;

  return config;
};

export default getConfig;
