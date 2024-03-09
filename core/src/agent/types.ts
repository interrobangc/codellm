import type { CodeLlmError } from '@/.';

import { z } from 'zod';

import { toolRunParamsParamSchema } from '@/tool/types.js';

export const agentResponseResponseSchema = z.object({
  code: z
    .array(
      z.object({
        code: z.string(),
        language: z.string(),
      }),
    )
    .optional(),
  content: z.string(),
  reason: z.string().optional(),
  type: z.literal('response'),
});

export type AgentResponseResponse = z.infer<typeof agentResponseResponseSchema>;

export const isAgentResponseResponse = (
  i: AgentSelectToolResponse,
): i is AgentResponseResponse => {
  return i.type === 'response';
};

export const agentToolResponseSchema = z.object({
  name: z.string(),
  params: toolRunParamsParamSchema,
  reason: z.string(),
  type: z.literal('tool'),
});

export type AgentToolResponse = z.infer<typeof agentToolResponseSchema>;

export const isAgentToolResponse = (
  i: AgentSelectToolResponse,
): i is AgentToolResponse => {
  return i.type === 'tool';
};

export const agentLlmResponseSchema = z.union([
  agentResponseResponseSchema,
  agentToolResponseSchema,
]);

export type Agent = {
  chat: (message: string) => Promise<AgentResponse>;
};

export type AgentResponseCodeItem = {
  code: string;
  language: string;
};

export type AgentResponseCodeItemList = AgentResponseCodeItem[];

export type AgentSelectToolResponse = AgentResponseResponse | AgentToolResponse;

export type AgentResponse = CodeLlmError | AgentResponseResponse;

export type AgentToolResponses = Record<string, string>;

export type AgentHandleQuestionParams = {
  depth?: number;
  error?: string | null;
  question: string;
  toolResponses?: AgentToolResponses;
};

export type AgentHandleToolResponseParams = {
  response: AgentSelectToolResponse;
  toolResponses: AgentToolResponses;
};
