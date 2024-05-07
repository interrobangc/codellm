import type { CodeLlmErrorParams, ErrorCode } from '@/.';

import { CODE_LLM_ERRORS } from './constants.js';
import { getConfig } from '@/config/index.js';

const isErrorCode = (code: unknown): code is keyof typeof CODE_LLM_ERRORS => {
  return (code as string) in CODE_LLM_ERRORS;
};

const getErrorMessage = <TCode extends TCodeBase, TCodeBase = ErrorCode>(
  code: TCode,
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

export type CodeLlmErrorType = CodeLlmError<ErrorCode>;

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
  TCode extends TCodeBase,
  TCodeBase = ErrorCode,
> extends Error {
  code: TCode;

  override message: string;

  override cause: CodeLlmErrorParams<TCode, TCodeBase>['cause'];

  meta: CodeLlmErrorParams<TCode, TCodeBase>['meta'];

  constructor({
    cause,
    code,
    message,
    meta,
  }: CodeLlmErrorParams<TCode, TCodeBase>) {
    super();
    this.code = code;
    this.message = getErrorMessage<TCode, TCodeBase>(code, message);
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
export const isError = <TCode extends TCodeBase, TCodeBase = ErrorCode>(
  target: unknown,
  code?: TCode,
): target is CodeLlmError<TCode, TCodeBase> => {
  return (
    target instanceof CodeLlmError &&
    (!code || (target as CodeLlmError<TCode, TCodeBase>).code === code)
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
export const mayFail = <T, TCode extends TCodeBase, TCodeBase = ErrorCode>(
  target: () => T,
  code: TCode,
  meta: CodeLlmErrorParams<TCode, TCodeBase>['meta'] = {},
) => {
  try {
    const targetResp = target();
    if (isError(targetResp)) throw targetResp;
    return targetResp;
  } catch (e) {
    return new CodeLlmError<TCode, TCodeBase>({ cause: e, code, meta });
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
export const promiseMayFail = async <
  T,
  TCode extends TCodeBase,
  TCodeBase = ErrorCode,
>(
  target: Promise<T>,
  code: TCode,
  meta: CodeLlmErrorParams<TCode, TCodeBase>['meta'] = {},
) => {
  try {
    const targetRes = await target;
    if (isError(targetRes)) throw targetRes;
    return targetRes;
  } catch (e) {
    return new CodeLlmError<TCode, TCodeBase>({ cause: e, code, meta });
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
  TCode extends TCodeBase,
  TCodeBase = ErrorCode,
>(
  map: Promise<T>[],
  code: TCode,
) => {
  const resolved = await Promise.allSettled(map);
  const errors = resolved.filter(
    (item) => item.status === 'rejected' || isError(item.value),
  );

  const results = resolved.filter((item) => item.status === 'fulfilled');
  if (errors.length) {
    return new CodeLlmError<TCode, TCodeBase>({
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
export const throwOrReturn = <TCode extends TCodeBase, TCodeBase = ErrorCode>(
  e: CodeLlmError<TCode, TCodeBase>,
) => {
  const config = getConfig();
  if (isError(config, 'config:NotInitialized')) throw e;

  const { shouldThrow } = config;
  if (shouldThrow) throw e;

  return e;
};

export const newError = (args: CodeLlmErrorParams<ErrorCode>) => {
  return new CodeLlmError(args);
};
