import { describe, expect, it, jest } from '@jest/globals';

import { decodeResponse } from './chat';

jest.mock('@/log/index.js');

describe('decodeResponse', () => {
  it('should decode a valid response', () => {
    const response = {
      type: 'response',
      content: 'some content',
    };
    const encodedResponse = JSON.stringify(response);
    expect(decodeResponse(encodedResponse)).toEqual(response);
  });

  it('should handle an error decoding a response', () => {
    const response = 'some invalid response';
    expect(decodeResponse(response)).toEqual({
      type: 'error',
      content: response,
    });
  });

  it('should handle an error decoding a response', () => {
    const response = {
      type: 'response',
      text: 'some content',
    };

    const encodedResponse = JSON.stringify(response);
    expect(decodeResponse(encodedResponse)).toEqual({
      type: 'error',
      content: encodedResponse,
    });
  });
});
