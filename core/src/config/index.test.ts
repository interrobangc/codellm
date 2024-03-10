import { describe, expect, it } from 'vitest';

import { PartialConfig, Provider } from '@/index.js';
import { unitTestConfig } from '@tests/mocks';
import { getConfig, initConfig } from './index';
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
});
