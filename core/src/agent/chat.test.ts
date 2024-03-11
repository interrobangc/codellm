import { describe, expect, it, vi } from 'vitest';
import { dump as dumpYaml } from 'js-yaml';

import { expectError, testSetup } from '@tests/tools';
// import { AGENT_RECURSION_DEPTH_MAX } from './constants';
import * as chat from './chat';

testSetup({ disableLog: false });

const question = 'some question';
const decodeError = 'agent:decodeResponse';

vi.mock('@/prompt/index.js', () => ({
  newPrompt: () => ({
    get: vi.fn().mockImplementation(() => 'some prompt'),
  }),
}));

describe('decodeResponse', () => {
  it('should decode a valid response', () => {
    const response = {
      name: 'codeSummaryQuery',
      params: {
        includeCode: true,
        query: 'parseFiles',
      },
      reason:
        'To provide context for answering user questions, we can use the `codeSummaryQuery` tool, which searches relevant code snippets and summaries in the vector database. This tool will help us understand the codebase better.',
      type: 'tool',
    };
    const encodedResponse = dumpYaml(response);
    expect(chat.decodeResponse(encodedResponse)).toEqual(response);
  });

  it('should handle an error decoding an invalid json response', () => {
    const response = 'some invalid response';

    expectError(chat.decodeResponse(response), decodeError);
  });

  it('should handle an error decoding a valid json response with incorrect type', () => {
    const response = {
      text: 'some content',
      type: 'response',
    };

    const encodedResponse = dumpYaml(response);
    expectError(chat.decodeResponse(encodedResponse), decodeError);
  });
});

describe('sendUserMessage', () => {
  it('should parse a response from a response message', async () => {
    const chatResponse = {
      content: 'some fake content',
      type: 'response' as const,
    };
    const agentLlm = {
      chat: async () => dumpYaml(chatResponse),
    };
    const toolResponses = [];
    const res = await chat.sendUserMessage({
      agentLlm,
      question,
      toolResponses,
    });

    expect(res).toEqual(chatResponse);
  });

  it('should parse a response from a tool message', async () => {
    const chatResponse = {
      name: 'fakeTool',
      params: {
        fakeParam: true,
      },
      reason: 'To answer the question',
      type: 'tool' as const,
    };
    const agentLlm = {
      chat: async () => dumpYaml(chatResponse),
    };
    const toolResponses = [];
    const res = await chat.sendUserMessage({
      agentLlm,
      question,
      toolResponses,
    });

    expect(res).toEqual(chatResponse);
  });

  it('should handle an error decoding a response', async () => {
    const chatResponse = 'some invalid response';
    const agentLlm = {
      chat: async () => dumpYaml(chatResponse),
    };
    const toolResponses = [];
    const res = await chat.sendUserMessage({
      agentLlm,
      question,
      toolResponses,
    });

    expectError(res, decodeError);
  });
});

describe('handleQuestionRecursive', () => {
  it('should handle a valid response immediately', async () => {
    const chatResponse = {
      content: 'some fake content',
      type: 'response' as const,
    };
    const agentLlm = {
      chat: async () => dumpYaml(chatResponse),
    };
    const toolResponses = [];
    const res = await chat.handleQuestionRecursive({
      agentLlm,
      question,
      toolResponses,
    });

    expect(res).toEqual(chatResponse);
  });

  // TODO: vite hangs on the recursive function call
  // it('should handle an error decoding a response', async () => {
  //   const handleQuestionSyp = vi.spyOn(chat, 'handleQuestionRecursive');
  //   const chatResponse = 'some invalid response';
  //   const agentLlm = {
  //     chat: async () => dumpYaml(chatResponse),
  //   };

  //   const res = await chat.handleQuestionRecursive({
  //     agentLlm,
  //     question,
  //   });

  //   expect(handleQuestionSyp).toHaveBeenCalledTimes(AGENT_RECURSION_DEPTH_MAX);

  //   expectError(res, decodeError);
  // });
});
