import type { CodeLlmError, Tools } from '@/.';

import { z } from 'zod';

import { toolRunParamsParamSchema } from '@/tool/types.js';

export const agentResponseResponseSchema = z.object({
  type: z.literal('response'),
  content: z.string(),
  reason: z.string().optional(),
  code: z
    .array(
      z.object({
        code: z.string(),
        language: z.string(),
      }),
    )
    .optional(),
});

export type AgentResponseResponse = z.infer<typeof agentResponseResponseSchema>;

export const isAgentResponseResponse = (
  i: AgentSelectToolResponse,
): i is AgentResponseResponse => {
  return i.type === 'response';
};

export const agentToolResponseSchema = z.object({
  type: z.literal('tool'),
  reason: z.string(),
  name: z.string(),
  params: toolRunParamsParamSchema,
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
  tools: Tools | undefined;
};

export type AgentHandleToolResponseParams = {
  response: AgentSelectToolResponse;
  toolResponses: AgentToolResponses;
  tools: Tools | undefined;
};
