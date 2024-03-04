import { describe, expect, it, jest } from '@jest/globals';
import { dump as dumpYaml } from 'js-yaml';

import { decodeResponse } from './chat';

jest.mock('@/log/index.js');

describe('decodeResponse', () => {
  it('should decode a valid response', () => {
    const response = {
      type: 'tool',
      reason:
        'To provide context for answering user questions, we can use the `codeSummaryQuery` tool, which searches relevant code snippets and summaries in the vector database. This tool will help us understand the codebase better.',
      name: 'codeSummaryQuery',
      params: {
        includeCode: true,
        query: 'parseFiles',
      },
    };
    const encodedResponse = dumpYaml(response);
    expect(decodeResponse(encodedResponse)).toEqual(response);
  });

  it('should handle an error decoding an invalid json response', () => {
    const response = 'some invalid response';

    expect(decodeResponse(response)).toEqual(
      expect.objectContaining({ type: 'error' }),
    );
  });

  it('should handle an error decoding a valid json response with incorrect type', () => {
    const response = {
      type: 'response',
      text: 'some content',
    };

    const encodedResponse = dumpYaml(response);
    expect(decodeResponse(encodedResponse)).toEqual(
      expect.objectContaining({ type: 'error' }),
    );
  });
});
