import type { CodeLlmErrorParams } from '@codellm/core';

import { ERROR_CODES } from './constants';

import {
  CodeLlmError,
  isError as baseIsError,
  mayFail as baseMayFail,
  promiseMayFail as basePromiseMayFail,
} from '@codellm/core';

export type ErrorCodes = typeof ERROR_CODES;

export type ErrorCode = keyof ErrorCodes;

export type RemixError = CodeLlmError<ErrorCodes>;

export const isError = (
  target: unknown,
  code?: ErrorCode,
): target is RemixError => baseIsError<ErrorCodes>(target, code);

export const mayFail = <T>(
  target: () => T,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCodes>['meta'] = {},
) => baseMayFail<T, ErrorCodes>(target, code, meta);

export const promiseMayFail = async <T>(
  target: Promise<T>,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCodes>['meta'] = {},
) => basePromiseMayFail<T, ErrorCodes>(target, code, meta);

export const newError = (params: CodeLlmErrorParams<ErrorCodes>) =>
  new CodeLlmError<ErrorCodes>(params);
