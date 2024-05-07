import type { ErrorCode } from '@remix/.server/errors';

import { expect } from 'vitest';
import { CodeLlmError } from '@codellm/core';

export const expectError = (resp: unknown, code: ErrorCode) => {
  expect(resp).toBeInstanceOf(CodeLlmError);
  expect((resp as CodeLlmError<ErrorCode, ErrorCode>).code).toEqual(code);
};
