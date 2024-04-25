import type {
  ErrorCode as BaseErrorCode,
  CodeLlmErrorParams,
} from '@codellm/core';

import { ERROR_CODES } from './constants';

import {
  CodeLlmError,
  isError as baseIsError,
  mayFail as BaseMayFail,
  promiseMayFail as basePromiseMayFail,
} from '@codellm/core';

export type RemixErrorCodes = keyof typeof ERROR_CODES;

export type ErrorCode = BaseErrorCode | RemixErrorCodes;

export type RemixError = CodeLlmError<ErrorCode, ErrorCode>;

export const isError = (
  target: unknown,
  code?: ErrorCode,
): target is RemixError => {
  return baseIsError<ErrorCode, ErrorCode>(target, code);
};

export const mayFail = <T>(
  target: () => T,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCode, ErrorCode>['meta'] = {},
) => {
  return BaseMayFail<T, ErrorCode, ErrorCode>(target, code, meta);
};

export const promiseMayFail = async <T>(
  target: Promise<T>,
  code: ErrorCode,
  meta: CodeLlmError<ErrorCode, ErrorCode>['meta'] = {},
) => {
  return basePromiseMayFail<T, ErrorCode, ErrorCode>(target, code, meta);
};

export const newError = (params: CodeLlmErrorParams<ErrorCode, ErrorCode>) => {
  return new CodeLlmError<ErrorCode, ErrorCode>(params);
};
