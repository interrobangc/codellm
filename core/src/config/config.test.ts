import { describe, expect, it } from 'vitest';

import { unitTestConfig } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { getConfig, setConfig } from './config';

describe('config', () => {
  it('should return the config', () => {
    setConfig(unitTestConfig);
    const config = getConfig();
    expect(config).toEqual(unitTestConfig);
  });

  it('should return an error if the config is not set', () => {
    setConfig(undefined);
    const config = getConfig();
    expectError(config, 'config:NotInitialized');
  });
});
