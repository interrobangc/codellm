import type { Config } from '@interrobangc/codellm';

import parseFile from './parseFile.js';
import DEFAULTS from './defaults.js';

export const getConfig = (): Partial<Config> => {
  const configFilePath = DEFAULTS.configFile;

  const configFile = parseFile(configFilePath);

  const config: Partial<Config> = {
    ...(configFile as Partial<Config>),
  };

  return config;
};

export default getConfig;
