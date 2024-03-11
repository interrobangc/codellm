import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  getValidLlmClient,
  getValidLlmProviderClient,
  unitTestConfig,
} from '@tests/mocks';
import { getConfig, initConfig } from '@/config/index.js';
import * as newLlmClient from './newLlmClient.js';
import * as importClient from './importClient.js';

vi.spyOn(importClient, 'importClient').mockImplementation(
  async (config, provider) => ({
    providerConfig: config.providers[provider].config,
    providerModule: {
      newClient: async () => getValidLlmProviderClient(),
    },
  }),
);

describe('newClient', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should create a new client for a given provider', async () => {
    const config = getConfig();
    const service = Object.keys(config.llms)[0];
    const res = await newLlmClient.newLlmClient({
      config,
      service,
    });

    expect(importClient.importClient).toHaveBeenCalledTimes(1);
    // Not a great test, but it is good enough for now
    expect(JSON.stringify(res)).toEqual(
      JSON.stringify(getValidLlmClient({ service })),
    );
  });
});
