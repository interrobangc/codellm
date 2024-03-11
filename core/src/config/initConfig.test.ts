import { describe, expect, it } from 'vitest';

import { PartialConfig, Provider } from '@/index.js';
import { unitTestConfig } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { getConfig } from './config.js';
import { initConfig } from './initConfig';
import { DEFAULTS, LLM_DEFAULTS } from './constants';

describe('initConfig', () => {
  it('should initialize the config with the defaults when called with base config', () => {
    initConfig(unitTestConfig);
    const config = getConfig();

    expect(config).toEqual({
      ...DEFAULTS,
      llms: LLM_DEFAULTS[DEFAULTS.llmProvider],
      ...unitTestConfig,
    });
  });

  it('should merge the new config with the defaults', () => {
    const llms = {
      embedding: {
        model: 'some-fake-provider',
        provider: 'openai' as Provider,
      },
    };
    const newConfig: PartialConfig = {
      ...unitTestConfig,
      llmProvider: 'openai',
      llms,
    };
    initConfig(newConfig);
    const config = getConfig();
    expect(config.llmProvider).toEqual('openai');
    expect(config.llms).toEqual(expect.objectContaining(llms));
  });

  it('should return an error if the config is missing required keys', () => {
    const newConfig: PartialConfig = {
      ...unitTestConfig,
      project: {},
    };
    const res = initConfig(newConfig);
    expectError(res, 'config:ValidationError');
  });
});
