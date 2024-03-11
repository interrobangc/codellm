import { beforeAll, describe, expect, it } from 'vitest';

import { unitTestConfig } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import { DEFAULTS, DEFAULT_PROMPTS } from './constants.js';
import * as initPrompts from './initPrompts.js';

describe('initPrompts', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  it('should initialize prompts', async () => {
    const res = initPrompts.initPrompts();
    expect(res.get).toBeDefined();

    const agentSystemRolePrompt = await res.get('agentSystemRole');

    expect(agentSystemRolePrompt).toEqual(
      DEFAULT_PROMPTS.agentSystemRole.replace(
        /\{responseFormat\}/g,
        DEFAULTS.responseFormat,
      ),
    );

    const badPrompt = await res.get('notAValidPrompt');
    expectError(badPrompt, 'prompt:notFound');
  });
});
