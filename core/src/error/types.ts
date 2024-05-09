import type { CODE_LLM_ERRORS } from './constants';

import { z } from 'zod';

export type ErrorCodes = typeof CODE_LLM_ERRORS;
export type ErrorCode = keyof ErrorCodes;

export type CodeLlmErrorParams<TCodes extends ErrorCodes = ErrorCodes> = {
  cause?: unknown;
  code: keyof TCodes;
  message?: string;
  meta?: Record<string, unknown>;
};

export const codeLlmErrorSchema = z.object({
  cause: z.unknown().optional(),
  code: z.string(),
  message: z.string(),
  meta: z.record(z.unknown()).optional(),
});
