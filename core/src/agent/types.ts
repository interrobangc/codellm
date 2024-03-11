import type { CodeLlmError, LlmClient } from '@/.';

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

export type AgentLlmResponse = z.infer<typeof agentLlmResponseSchema>;

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

export type AgentToolResponseItem = {
  name: string;
  response: string;
};

// TODO: this needs to be updated to an array of AgentToolResponseItem so we don't lose tool responses to the same tool
export type AgentToolResponses = Record<string, string>;

export type AgentHandleQuestionParams = {
  agentLlm: LlmClient;
  depth?: number;
  error?: string | null;
  question: string;
  toolResponses?: AgentToolResponses;
};

export type AgentHandleToolResponseParams = {
  response: AgentSelectToolResponse;
  toolResponses: AgentToolResponses;
};
