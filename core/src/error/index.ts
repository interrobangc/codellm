import type { CodeLlmErrorParams, ErrorCode } from '@/.';

import { ERRORS } from './constants.js';

export class CodeLlmError extends Error {
  code: ErrorCode;

  override message: string;

  override cause: CodeLlmErrorParams['cause'];

  meta: CodeLlmErrorParams['meta'];

  constructor({ code, cause, meta }: CodeLlmErrorParams) {
    super();
    this.code = code;
    this.message = ERRORS[code]?.message || code;
    this.cause = cause;
    this.meta = meta || {};
  }
}

export const isError = (error: unknown): error is CodeLlmError => {
  return error instanceof CodeLlmError;
};
