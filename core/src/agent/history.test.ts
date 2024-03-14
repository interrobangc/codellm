import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CodeLlmError } from '@/error/index.js';
import { testSetup } from '@tests/tools/';
import {
  addToHistory,
  clearHistory,
  getHistories,
  getHistory,
} from './history.js';

const { mockEmit } = testSetup();

describe('addToHistory', () => {
  beforeEach(() => {
    clearHistory();
    vi.clearAllMocks();
  });

  const responses = [
    {
      params: {
        code: [
          {
            code: 'const a = 1',
            language: 'typescript',
          },
        ],
        content: 'This is an assistant response',
        type: 'response',
      },
      result: {
        code: [
          {
            code: 'const a = 1',
            language: 'typescript',
          },
        ],
        content: 'This is an assistant response',
        role: 'assistant',
      },
    },
    {
      params: {
        content: 'This is a user message',
        role: 'user',
      },
      result: {
        content: 'This is a user message',
        role: 'user',
      },
      role: 'user',
    },
    {
      params: {
        error: new CodeLlmError('error:unknown'),
        role: 'error',
      },
      result: {
        error: new CodeLlmError('error:unknown'),
        role: 'error',
      },
      role: 'tool',
    },
  ];

  it.each(responses)('should add a history item for %s', (response) => {
    const id = 'test-id';
    const addRes = addToHistory(id, response.params);
    expect(addRes).toEqual(
      expect.objectContaining(new Map([[id, [response.result]]])),
    );
    expect(mockEmit).toHaveBeenCalledWith(response.result);

    const getRes = getHistory(id);
    expect(getRes).toHaveLength(1);
    expect(getRes[0]).toEqual(expect.objectContaining(response.result));

    const histories = getHistories();
    expect(Object.fromEntries(histories)).toEqual(
      expect.objectContaining({ [id]: [response.result] }),
    );
  });
});
