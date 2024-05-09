import type { CodeLlmErrorParams, ErrorCodes } from '@/.';

import { CODE_LLM_ERRORS } from './constants.js';
import { getConfig } from '@/config/index.js';

/**
 * These functions make up a TS safe error handling system.
 *
 * The types are a bit messy and overly complicated so that this system can be extended
 * and used by other projects that use it (like the Remix frontend).
 *
 * The double generics extends/defaults are ugly, but it works. The
 * base problem is that we want type hinting for the error codes, but we also want to
 * allow for custom error codes in the Remix project.
 *
 * Since the
 */

const isErrorCode = (code: unknown): code is keyof typeof CODE_LLM_ERRORS => {
  return (code as string) in CODE_LLM_ERRORS;
};

const getErrorMessage = <TCodes extends ErrorCodes = ErrorCodes>(
  code: keyof TCodes,
  message?: string,
): string => {
  if (message) {
    return message;
  }

  if (isErrorCode(code)) {
    return CODE_LLM_ERRORS[code]?.message || code;
  }

  return code as string;
};

export type CodeLlmErrorType = CodeLlmError<ErrorCodes>;

/**
 * A custom error class for the CodeLlm project.
 *
 * We extend the base Error class because folks know how to deal with them and they include a stack trace.
 *
 * We change the call signature to include a code, cause, and meta data.
 *
 * The code is a string that represents the error. It should be unique and descriptive.
 * The message will be pulled from the CODE_LLM_ERRORS constant.
 */
export class CodeLlmError<
  TCodes extends ErrorCodes = ErrorCodes,
> extends Error {
  code: keyof TCodes;

  override message: string;

  override cause: CodeLlmErrorParams<TCodes>['cause'];

  meta: CodeLlmErrorParams<TCodes>['meta'];

  constructor({ cause, code, message, meta }: CodeLlmErrorParams<TCodes>) {
    super();
    this.code = code;
    this.message = getErrorMessage<TCodes>(code, message);
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
export const isError = <TCodes extends ErrorCodes = ErrorCodes>(
  target: unknown,
  code?: keyof TCodes,
): target is CodeLlmError<TCodes> => {
  return (
    target instanceof CodeLlmError &&
    (!code || (target as CodeLlmError<TCodes>).code === code)
  );
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
export const mayFail = <T, TCodes extends ErrorCodes = ErrorCodes>(
  target: () => T,
  code: keyof TCodes,
  meta: CodeLlmErrorParams<TCodes>['meta'] = {},
) => {
  try {
    const targetResp = target();
    if (isError(targetResp)) throw targetResp;
    return targetResp;
  } catch (e) {
    return new CodeLlmError<TCodes>({ cause: e, code, meta });
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
export const promiseMayFail = async <T, TCodes extends ErrorCodes = ErrorCodes>(
  target: Promise<T>,
  code: keyof TCodes,
  meta: CodeLlmErrorParams<TCodes>['meta'] = {},
) => {
  try {
    const targetRes = await target;
    if (isError(targetRes)) throw targetRes;
    return targetRes;
  } catch (e) {
    return new CodeLlmError<TCodes>({ cause: e, code, meta });
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
export const promiseMapMayFail = async <
  T,
  TCodes extends ErrorCodes = ErrorCodes,
>(
  map: Promise<T>[],
  code: keyof TCodes,
) => {
  const resolved = await Promise.allSettled(map);
  const errors = resolved.filter(
    (item) => item.status === 'rejected' || isError(item.value),
  );

  const results = resolved.filter((item) => item.status === 'fulfilled');
  if (errors.length) {
    return new CodeLlmError<TCodes>({
      code,
      meta: { errors, results },
    });
  }

  return results.map((item) => (item as PromiseFulfilledResult<T>).value);
};

/**
 * Throw the error if the config is initialized and shouldThrow is true
 *
 * @param {CodeLlmError} e The error to handle
 *
 * @returns The error
 * @throws The error if the config is initialized and shouldThrow is true
 */
export const throwOrReturn = <TCodes extends ErrorCodes = ErrorCodes>(
  e: CodeLlmError<TCodes>,
) => {
  const config = getConfig();
  if (isError(config, 'config:NotInitialized')) throw e;

  const { shouldThrow } = config;
  if (shouldThrow) throw e;

  return e;
};

export const newError = (args: CodeLlmErrorParams<ErrorCodes>) => {
  return new CodeLlmError(args);
};
