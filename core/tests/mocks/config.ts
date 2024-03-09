import type { PartialConfig } from '@/.';

export const testConfig: PartialConfig = {
  paths: {
    cache: './.cache',
    project: './testProject',
  },
  project: {
    name: 'testProject',
  },
  tools: {
    fakeToolName: {
      config: {
        vectorDbName: 'fakeVectorDbName',
      },
      module: '@fakeProject/tool-that-does-not-exist',
    },
  },
};
