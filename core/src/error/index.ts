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

export const isError = (error: unknown): error is CodeLlmError => {
  return error instanceof CodeLlmError;
};

export const handleMapMaybe = async (
  map: Promise<unknown>[],
  code: ErrorCode,
) => {
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
