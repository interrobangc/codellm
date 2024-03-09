import type { PartialConfig } from '@/.';

export const testConfig: PartialConfig = {
  paths: {
    cache: './.cache',
    project: './testProject',
  },
  project: {
    name: 'testProject',
  },
};
