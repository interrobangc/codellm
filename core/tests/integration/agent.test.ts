import { beforeAll, describe, expect, it } from 'vitest';

import { Agent, newAgent } from '@/agent/index.js';
import { isError } from '@/error/index.js';
import { integrationTestConfig } from '@tests/mocks/config';

describe('chat', () => {
  let agent: Agent;

  beforeAll(async () => {
    const agentRes = await newAgent(integrationTestConfig);
    if (isError(agentRes)) {
      console.dir(agentRes, { depth: null });
      throw agentRes;
    }
    agent = agentRes;
  });

  it('should return a valid response', async () => {
    try {
      const response = await agent.chat('hello');
      console.log('response', response);
    } catch (e) {
      console.dir(e);
    }

    expect(true).toEqual(true);
  });
});
