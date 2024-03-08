import type { ERRORS } from './constants';

export type ErrorCode = keyof typeof ERRORS;

export type ErrorConstItem = {
  message: string;
};

export type ErrorConsts = Record<string, ErrorConstItem>;

export type CodeLlmErrorParams = {
  code: ErrorCode;
  cause?: unknown;
  meta?: Record<string, unknown>;
};
