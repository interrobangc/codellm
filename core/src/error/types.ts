import type { CODE_LLM_ERRORS } from './constants';

import { z } from 'zod';

export type ErrorCode = keyof typeof CODE_LLM_ERRORS;

export type CodeLlmErrorParams<
  TCode extends TCodeBase,
  TCodeBase = ErrorCode,
> = {
  cause?: unknown;
  code: TCode;
  message?: string;
  meta?: Record<string, unknown>;
};

export const codeLlmErrorSchema = z.object({
  cause: z.unknown().optional(),
  code: z.string(),
  message: z.string(),
  meta: z.record(z.unknown()).optional(),
});
