import { Agent } from '@codellm/core';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

const llmAgentMock = mockDeep<Agent>();

beforeEach(() => {
  mockReset(llmAgentMock);
});

export { llmAgentMock };
