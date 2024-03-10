import type { CodeLlmErrorParams, ErrorCode } from '@/.';

import { ERRORS } from './constants.js';

/**
 * A custom error class for the CodeLlm project.
 *
 * We extend the base Error class because folks know how to deal with them and they include a stack trace.
 *
 * We change the call signature to include a code, cause, and meta data.
 *
 * The code is a string that represents the error. It should be unique and descriptive.
 * The message will be pulled from the ERRORS constant.
 */
export class CodeLlmError extends Error {
  code: CodeLlmErrorParams['code'];

  override message: string;

  override cause: CodeLlmErrorParams['cause'];

  meta: CodeLlmErrorParams['meta'];

  constructor({ cause, code, meta }: CodeLlmErrorParams) {
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
 * @param {unknown} target The error to check
 *
 * @returns {bool} Whether the target is a CodeLlmError
 */
export const isError = (
  target: unknown,
  code?: ErrorCode,
): target is CodeLlmError => {
  return target instanceof CodeLlmError && (!code || target.code === code);
};

/**
 * Resolves a target that could throw and returns a CodeLlmError if the target fails
 *
 * @param {() => T} target The function to handle
 * @param {ErrorCode} code The error code to use if the target fails
 * @param {CodeLlmErrorParams['meta']} meta The meta data to include in the error
 *
 * @returns The result of the target or a CodeLlmError with the error in the meta
 */
export const mayFail = <T>(
  target: () => T,
  code: ErrorCode,
  meta: CodeLlmErrorParams['meta'] = {},
) => {
  try {
    const targetResp = target();
    if (isError(targetResp)) throw targetResp;
    return targetResp;
  } catch (e) {
    return new CodeLlmError({ cause: e, code, meta });
  }
};

/**
 * Resolves a promise that could throw and returns a CodeLlmError if the promise fails
 *
 * @param {Promise<T>} target The promise to handle
 * @param {ErrorCode} code The error code to use if the promise fails
 * @param {CodeLlmErrorParams['meta']} meta The meta data to include in the error
 *
 * @returns - The result of the promise or a CodeLlmError with the error in the meta
 *
 */
export const promiseMayFail = async <T>(
  target: Promise<T>,
  code: ErrorCode,
  meta: CodeLlmErrorParams['meta'] = {},
) => {
  try {
    const targetRes = await target;
    if (isError(targetRes)) throw targetRes;
    return targetRes;
  } catch (e) {
    return new CodeLlmError({ cause: e, code, meta });
  }
};

/**
 * Resolves a map of promises and return a CodeLlmError if any of the promises fail
 *
 * @param {Promise<T>[]} map The map of promises to handle
 * @param {ErrorCode} code The error code to use if any of the promises fail
 *
 * @returns - The results of the promises or a CodeLlmError with the errors and results in the meta
 */
export const promiseMapMayFail = async <T>(
  map: Promise<T>[],
  code: ErrorCode,
) => {
  const resolved = await Promise.allSettled(map);
  const errors = resolved.filter(
    (item) => item.status === 'rejected' || isError(item.value),
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
