import type { CODE_LLM_ERRORS } from './constants';

import { z } from 'zod';

export type ErrorCode = keyof typeof CODE_LLM_ERRORS;

export type ErrorConstItem = {
  message: string;
};

export type ErrorConsts = Record<string, ErrorConstItem>;

export type CodeLlmErrorParams = {
  cause?: unknown;
  code: ErrorCode;
  message?: string;
  meta?: Record<string, unknown>;
};

export type CodeLlmLibErrorParams = CodeLlmErrorParams & {
  code: string;
  errorConsts: ErrorConsts;
};

export const codeLlmErrorSchema = z.object({
  cause: z.unknown().optional(),
  code: z.string(),
  message: z.string(),
  meta: z.record(z.unknown()).optional(),
});
