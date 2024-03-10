import { beforeAll, describe, expect, it, vi } from 'vitest';

import { Agent, agentResponseResponseSchema, newAgent } from '@/agent/index.js';
import { isError } from '@/error/index.js';
import { integrationTestConfig } from '@tests/mocks/config';
import * as tool from '@/tool/index.js';

describe('chat', () => {
  let agent: Agent;

  beforeAll(async () => {
    const agentRes = await newAgent(integrationTestConfig);
    if (isError(agentRes)) {
      throw agentRes;
    }
    agent = agentRes;
  });

  it('when asked about the task should return a valid response', async () => {
    const response = await agent.chat('What is your task?');

    expect(() => agentResponseResponseSchema.parse(response)).not.toThrow();
    expect(response.type).toBe('response');
    expect(response.content).toBeTypeOf('string');
  });

  it('when asked a question that should require a tool should call tool and return a valid response', async () => {
    const getToolSpy = vi.spyOn(tool, 'getTool').mockReturnValue({
      run: async () => ({
        content: 'This is the content of a really good readme file',
        success: true,
      }),
    });
    const response = await agent.chat(
      'Can you give me the current contents of the README.md file?',
    );

    expect(getToolSpy).toHaveBeenCalled();

    expect(() => agentResponseResponseSchema.parse(response)).not.toThrow();
    expect(response.type).toBe('response');
    expect(response.content).toBeTypeOf('string');
  });
});
