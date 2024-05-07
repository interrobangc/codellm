import { vi } from 'vitest';
import { Agent } from '@codellm/core';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

const llmAgentMock = mockDeep<Agent>();

beforeEach(() => {
  mockReset(llmAgentMock);
});

vi.mock('@codellm/core', async (importOriginal) => {
  const original = await importOriginal();
  return {
    AGENT_EMITTER_CHANNELS: {
      assistant: 'agent:assistant',
      error: 'agent:error',
      tool: 'agent:tool',
      user: 'agent:user',
    } as const,
    // @ts-expect-error - This is a mock
    CodeLlmError: original.CodeLlmError,
    // @ts-expect-error - This is a mock
    isError: () => original.isError,
    newAgent: () => llmAgentMock,
    // @ts-expect-error - This is a mock
    promiseMayFail: original.promiseMayFail,
  };
});

export { llmAgentMock };
