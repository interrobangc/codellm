import type { ErrorCode } from '@/.';

import { expect } from 'vitest';
import { CodeLlmError } from '@/error/index.js';

export const expectError = (resp: unknown, code: ErrorCode) => {
  expect(resp).toBeInstanceOf(CodeLlmError);
  expect((resp as CodeLlmError).code).toEqual(code);
};
