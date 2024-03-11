import { beforeAll, describe, expect, it, vi } from 'vitest';

import { testSetup } from '@tests/tools';
import * as error from '@/error/index.js';
import * as llm from '@/llm/index.js';
import * as tool from '@/tool/index.js';
import * as chat from './chat';
import { handleToolResponse } from './handleToolResponse';

const { logSpy } = testSetup();

const fakeToolResponse = {
  name: 'fakeTool',
  params: {
    fakeParam: true,
  },
  reason: 'To answer the question',
  type: 'tool',
} as chat.AgentToolResponse;

const fakeToolResponseContent = `a fake tool response`;

const fakeToolRunResponse = {
  content: fakeToolResponseContent,
  success: true,
};

describe('handleToolResponse', () => {
  let getToolSpy: vi.SpyInstance;
  let getLlmSpy: vi.SpyInstance;

  beforeAll(() => {
    getToolSpy = vi.spyOn(tool, 'getTool').mockImplementation(() => ({
      run: async () => fakeToolRunResponse,
    }));

    getLlmSpy = vi.spyOn(llm, 'getLlm').mockImplementation(() => ({
      chat: async () => ({
        content: 'some fake content',
        role: 'user',
      }),
    }));
  });

  it('should handle a valid tool response', async () => {
    const res = await handleToolResponse({
      response: fakeToolResponse,
      toolResponses: [],
    });

    expect(getToolSpy).toHaveBeenCalled();
    expect(getLlmSpy).toHaveBeenCalled();
    expect(res).toEqual([
      { name: 'fakeTool', response: fakeToolResponseContent },
    ]);
  });

  it('should append a valid tool response to existing tool responses', async () => {
    const res = await handleToolResponse({
      response: fakeToolResponse,
      toolResponses: [{ name: 'otherTool', response: 'other response' }],
    });

    expect(getToolSpy).toHaveBeenCalled();
    expect(getLlmSpy).toHaveBeenCalled();
    expect(res).toEqual([
      { name: 'otherTool', response: 'other response' },
      { name: 'fakeTool', response: fakeToolResponseContent },
    ]);
  });

  it('should handle an error when the tool is not found', async () => {
    getToolSpy.mockImplementation(
      () => new error.CodeLlmError({ code: 'tool:notFound' }),
    );

    const res = await handleToolResponse({
      response: fakeToolResponse,
      toolResponses: [],
    });

    expect(res).toEqual([{ name: 'fakeTool', response: 'Tool not found' }]);
    expect(getToolSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Tool not found', 'error', {
      toolName: 'fakeTool',
    });
  });
});
