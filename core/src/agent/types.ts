import type { CodeLlmError, LlmClient } from '@/.';

import { z } from 'zod';
import { isError } from '@/error/index.js';
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
  i: AgentSelectToolResponse | CodeLlmError,
): i is AgentResponseResponse => {
  return !isError(i) && i.type === 'response';
};

export const agentToolResponseSchema = z.object({
  name: z.string(),
  params: toolRunParamsParamSchema,
  reason: z.string(),
  type: z.literal('tool'),
});

export type AgentToolResponse = z.infer<typeof agentToolResponseSchema>;

export const isAgentToolResponse = (
  i: AgentSelectToolResponse | CodeLlmError,
): i is AgentToolResponse => {
  return !isError(i) && i.type === 'tool';
};

export const agentLlmResponseSchema = z.union([
  agentResponseResponseSchema,
  agentToolResponseSchema,
]);

export type AgentLlmResponse = z.infer<typeof agentLlmResponseSchema>;

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

export type AgentToolResponses = AgentToolResponseItem[];

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

export type AgentHistoryUserItem = {
  content: string;
  role: 'user';
};

export type AgentHistoryAssistantItem = {
  code: AgentResponseResponse['code'] | undefined;
  content: AgentResponseResponse['content'];
  reason: AgentToolResponse['reason'] | undefined;
  role: 'assistant';
};

export type AgentHistoryItem = AgentHistoryUserItem | AgentHistoryAssistantItem;

export type AgentHistory = AgentHistoryItem[];

export type AgentHistoryAddParams =
  | AgentResponseResponse
  | AgentHistoryUserItem;

export const isAgentHistoryUserItem = (
  i: AgentHistoryAddParams,
): i is AgentHistoryUserItem => {
  return 'role' in i && i.role === 'user';
};

export type Agent = {
  chat: (message: string) => Promise<AgentResponse>;
  getHistory: () => AgentHistory;
};
