import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getValidLlmClient, unitTestConfig } from '@tests/mocks';
import { getConfig, initConfig } from '@/config/index.js';
import * as newLlmClient from './newLlmClient.js';

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
    const res = await newLlmClient.newLlmClient(
      {
        config,
        service,
      },
      'chat',
    );
    // Not a great test, but it is good enough for now
    expect(JSON.stringify(res)).toEqual(
      JSON.stringify(getValidLlmClient({ service })),
    );
  });
});
