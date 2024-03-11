import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { getValidLlmClient, unitTestConfig } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { CodeLlmError } from '@/error/index.js';
import { getConfig, initConfig } from '@/config/index.js';
import * as initLlms from './initLlms.js';
import * as newLlmClient from './newLlmClient.js';
import { isError } from 'lodash';

vi.mock('./newClient.js', () => ({
  newClient: vi.fn().mockImplementation(() => Promise.resolve()),
}));

const newLlmClientSpy = vi
  .spyOn(newLlmClient, 'newLlmClient')
  .mockImplementation(({ service }) =>
    Promise.resolve(getValidLlmClient({ service })),
  );

describe('initLlms', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  afterEach(() => {
    newLlmClientSpy.mockClear();
  });

  it('should initialize LLMs and their respective clients for later use', async () => {
    const config = getConfig();
    const servicesToInit = Object.keys(config.llms).map((n) => n);

    const initLlmClientsRes = await initLlms.initLlms(servicesToInit);

    expect(newLlmClientSpy).toHaveBeenCalledTimes(servicesToInit.length);
    expect([...initLlmClientsRes].map(([n]) => n)).toEqual(servicesToInit);
    Object.entries(initLlmClientsRes).forEach(([, client]) => {
      expect(isError(client)).toBe(false);
    });
  });

  it('should return an error if the client initialization fails', async () => {
    const config = getConfig();
    const servicesToInit = Object.keys(config.llms).map((n) => n);

    newLlmClientSpy.mockImplementation(() =>
      Promise.resolve(new CodeLlmError({ code: 'llm:initClients' })),
    );

    const initLlmClientsRes = await initLlms.initLlms(servicesToInit);

    expect(newLlmClientSpy).toHaveBeenCalledTimes(servicesToInit.length);
    expectError(initLlmClientsRes, 'llm:initClients');
  });
});
