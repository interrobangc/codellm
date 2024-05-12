import type { ErrorCode } from '@remix/.server/errors';

import { expect } from 'vitest';
import { isError } from '@remix/.server/errors';

export const expectError = (resp: unknown, code: ErrorCode) => {
  expect(isError(resp, code)).toBeTruthy();
};
