import { vi } from 'vitest';
import { Agent } from '@codellm/core';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

const llmAgentMock = mockDeep<Agent>();

beforeEach(() => {
  mockReset(llmAgentMock);
});

vi.mock('@codellm/core', () => ({
  AGENT_EMITTER_CHANNELS: {
    assistant: 'agent:assistant',
    error: 'agent:error',
    tool: 'agent:tool',
    user: 'agent:user',
  } as const,
  isError: () => false,
  newAgent: () => llmAgentMock,
}));

export { llmAgentMock };
