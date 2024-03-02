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
  query: z.string(),
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

export type AgentErrorResponse = {
  type: 'error';
  content: string;
};

export const isAgentErrorResponse = (
  i: AgentSelectToolResponse,
): i is AgentErrorResponse => {
  return i.type === 'error';
};

export type AgentSelectToolResponse =
  | AgentErrorResponse
  | AgentResponseResponse
  | AgentToolResponse;

export type AgentResponse = AgentErrorResponse | AgentResponseResponse;
