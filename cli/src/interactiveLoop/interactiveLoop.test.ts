import { describe, expect, it, vi } from 'vitest';
import * as codellm from '@codellm/core';

import { handleQuestion } from './interactiveLoop';

vi.mock('./promptUser.js', () => ({
  promptUser: vi.fn().mockImplementation(() => 'question'),
}));

const fakeResponse = {
  content: 'fake response',
  type: 'response' as const,
};

const mockedAgent = vi.mocked({
  chat: async () => fakeResponse,
});

const logSpy = vi.spyOn(codellm, 'log').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('handleQuestion', () => {
  it('should log correctly when agent.chat() response is valid', async () => {
    await handleQuestion(mockedAgent);

    expect(logSpy).toHaveBeenCalledWith('Agent response', 'debug', {
      response: fakeResponse,
    });

    expect(consoleLogSpy).toHaveBeenCalledWith('[bot] fake response');
  });

  it('should log correctly when agent.chat() response is an error', async () => {
    const code = 'agent:maxDepthExceeded';
    const error = new codellm.CodeLlmError({
      code,
    });
    const mockedAgentWithError = vi.mocked({
      chat: async () => error,
    });

    await handleQuestion(mockedAgentWithError);

    expect(logSpy).toHaveBeenCalledWith('Agent response error', 'error', {
      response: error,
    });
  });
});
