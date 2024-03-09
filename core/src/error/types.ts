import type { ERRORS } from './constants';

export type ErrorCode = keyof typeof ERRORS;

export type ErrorConstItem = {
  message: string;
};

export type ErrorConsts = Record<string, ErrorConstItem>;

export type CodeLlmErrorParams = {
  cause?: unknown;
  code: ErrorCode;
  meta?: Record<string, unknown>;
};

export type CodeLlmLibErrorParams = CodeLlmErrorParams & {
  code: string;
  errorConsts: ErrorConsts;
};
