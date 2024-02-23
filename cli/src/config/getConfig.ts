import { CodeLlmConfig } from '@interrobangc/codellm'

import parseFile from './parseFile'
import DEFAULTS from './defaults'

export const getConfig = (): CodeLlmConfig => {
  const configFilePath = DEFAULTS.configFile;

  const configFile = parseFile(configFilePath);

  const config: CodeLlmConfig = {
    ...(configFile as CodeLlmConfig),
  };

  return config;
}

export default getConfig;
