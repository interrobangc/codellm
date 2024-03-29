import merge from 'lodash/merge.js';

import { DEFAULTS, PROVIDERS } from '@cli/config/constants.js';

export const configFileData = {
  llmProvider: 'ollama',
  logLevel: 'info',
  project: {
    name: 'someProject',
    path: 'some/path',
  },
};

export const expectedDefaultConfig = merge({}, DEFAULTS, configFileData, {
  providers: PROVIDERS,
});
