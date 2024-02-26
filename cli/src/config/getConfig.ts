import type { Config } from '@interrobangc/codellm';

import parseFile from './parseFile.js';
import DEFAULTS from './defaults.js';

export const getConfig = (): Config => {
  const configFilePath = DEFAULTS.configFile;

  const configFile = parseFile(configFilePath);

  const config: Config = {
    ...(configFile as Config),
  };

  return config;
};

export default getConfig;
