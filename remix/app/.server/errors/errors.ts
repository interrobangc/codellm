import type { CodeLlmErrorParams } from '@codellm/core';

import { ERROR_CODES } from './constants';

import {
  CodeLlmError,
  isError as baseIsError,
  mayFail as BaseMayFail,
  promiseMayFail as basePromiseMayFail,
} from '@codellm/core';

export type ErrorCodes = typeof ERROR_CODES;

export type ErrorCode = keyof ErrorCodes;

export type RemixError = CodeLlmError<ErrorCodes>;

export const isError = (
  target: unknown,
  code?: ErrorCode,
): target is RemixError => {
  return baseIsError<ErrorCodes>(target, code);
};

export const mayFail = <T>(
  target: () => T,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCodes>['meta'] = {},
) => {
  return BaseMayFail<T, ErrorCodes>(target, code, meta);
};

export const promiseMayFail = async <T>(
  target: Promise<T>,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCodes>['meta'] = {},
) => {
  return basePromiseMayFail<T, ErrorCodes>(target, code, meta);
};

export const newError = (params: CodeLlmErrorParams<ErrorCodes>) => {
  return new CodeLlmError<ErrorCodes>(params);
};
