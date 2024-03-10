import { describe, expect, it } from 'vitest';
import { dump as dumpYaml } from 'js-yaml';

import { expectError, testSetup } from '@tests/tools';
import * as chat from './chat';

testSetup();

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

    expectError(chat.decodeResponse(response), 'agent:decodeResponse');
  });

  it('should handle an error decoding a valid json response with incorrect type', () => {
    const response = {
      text: 'some content',
      type: 'response',
    };

    const encodedResponse = dumpYaml(response);
    expectError(chat.decodeResponse(encodedResponse), 'agent:decodeResponse');
  });
});
