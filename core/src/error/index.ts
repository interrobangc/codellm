import type { CodeLlmErrorParams, ErrorCode } from '@/.';

import { ERRORS } from './constants.js';

export class CodeLlmError extends Error {
  code: CodeLlmErrorParams['code'];

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

/**
 * Check if an error is a CodeLlmError
 *
 * @param {unknown} error The error to check
 *
 * @returns {bool} Whether the error is a CodeLlmError
 */
export const isError = (
  error: unknown,
  code?: ErrorCode,
): error is CodeLlmError => {
  return error instanceof CodeLlmError && (!code || error.code === code);
};

/**
 * Handle a map of promises and return a CodeLlmError if any of the promises fail
 *
 * @param {Promise<unknown>[]} map The map of promises to handle
 * @param {ErrorCode} code The error code to use if any of the promises fail
 *
 * @returns - The results of the promises or a CodeLlmError
 */
export const mapMaybe = async (map: Promise<unknown>[], code: ErrorCode) => {
  const resolved = await Promise.allSettled(map);
  const errors = resolved.filter(
    (item) => item.status === 'rejected' || isError(item),
  );

  const results = resolved.filter((item) => item.status === 'fulfilled');
  if (errors.length) {
    return new CodeLlmError({
      code,
      meta: { errors, results },
    });
  }

  return results;
};
