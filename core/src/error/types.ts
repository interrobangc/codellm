import type { CONFIG_ERRORS, LOG_ERRORS } from '@/.';

export type ErrorCode = keyof typeof CONFIG_ERRORS | keyof typeof LOG_ERRORS;

export type ErrorConstItem = {
  message: string;
};

export type ErrorConsts = Record<string, ErrorConstItem>;

export type CodeLlmErrorParams = {
  code: ErrorCode;
  cause?: unknown;
  meta?: Record<string, unknown>;
};
