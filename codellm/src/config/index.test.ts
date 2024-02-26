import { describe, expect, it } from '@jest/globals';

import { getConfig, initConfig } from './index';
import { DEFAULTS } from './constants';
import type { PartialConfig } from './types';
import type { Provider } from '../llm';

describe('initConfig', () => {
  it('should initialize the config with the defaults when called with no arguments', () => {
    initConfig({});
    const config = getConfig();
    expect(config).toEqual(DEFAULTS);
  });

  it('should merge the new config with the defaults', () => {
    const llms = {
      embedding: {
        provider: 'openai' as Provider,
        model: 'some-fake-provider',
      },
    };
    const newConfig: PartialConfig = {
      llmProvider: 'openai',
      llms,
    };
    initConfig(newConfig);
    const config = getConfig();
    expect(config.llmProvider).toEqual('openai');
    expect(config.llms).toEqual(expect.objectContaining(llms));
  });
});
