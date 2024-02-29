import merge from 'lodash/merge.js';

import { DEFAULTS } from '@cli/config/constants.js';

export const configFileData = {
  path: 'some/path',
  logLevel: 'info',
  llmProvider: 'ollama',
};

export const expectedDefaultConfig = merge({}, DEFAULTS, configFileData);