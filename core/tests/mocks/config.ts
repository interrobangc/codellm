import type { PartialConfig } from '@/.';
import { getValidLlmProviderClient } from './llms';

export const unitTestConfig: PartialConfig = {
  paths: {
    cache: './.cache',
    project: './testProject',
  },
  project: {
    name: 'testProject',
  },
  providers: {
    ollama: {
      config: {
        fakeProviderConfig: 'fakeProvider',
      },
      module: {
        newClient: () => getValidLlmProviderClient(),
      },
    },
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

export const integrationTestConfig: PartialConfig = {
  llmProvider: 'ollama',
  // logLevel: 'silly',
  paths: {
    cache: './.cache',
    project: './tests/integration',
  },
  project: {
    name: 'integrationTestProject',
  },
  tools: {
    codeElementsQuery: {
      config: {
        vectorDbCollectionName: 'codeElements',
        vectorDbName: 'chromadb',
      },
      module: '@codellm/tool-code-elements-query',
    },
    fileReader: {
      config: {
        maxFileCount: 3,
      },
      module: '@codellm/tool-file-reader',
    },
    projectGlob: {
      module: '@codellm/tool-project-glob',
    },
  },
};
