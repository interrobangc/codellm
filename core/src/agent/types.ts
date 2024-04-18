import type {
  AGENT_EMITTER_CHANNELS,
  CodeLlmError,
  LlmClient,
  ToolRunParamsParams,
} from '@/.';

import { z } from 'zod';
import { isError, mayFail } from '@/error/index.js';
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
  i: unknown,
): i is AgentResponseResponse => {
  const res = mayFail(
    () => agentResponseResponseSchema.parse(i),
    'error:unknown',
  );
  return !isError(res);
};

export const agentToolResponseSchema = z.object({
  name: z.string(),
  params: toolRunParamsParamSchema,
  reason: z.string(),
  type: z.literal('tool'),
});

export type AgentToolResponse = z.infer<typeof agentToolResponseSchema>;

export const isAgentToolResponse = (i: unknown): i is AgentToolResponse => {
  const res = mayFail(() => agentToolResponseSchema.parse(i), 'error:unknown');
  return !isError(res);
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
  id: string;
  question: string;
  toolResponses?: AgentToolResponses;
};

export type AgentHandleToolResponseParams = {
  id: string;
  response: AgentSelectToolResponse;
  toolResponses: AgentToolResponses;
};

export type AgentHistoryAssistantItem = {
  code: AgentResponseResponse['code'] | undefined;
  content: AgentResponseResponse['content'];
  reason: AgentToolResponse['reason'] | undefined;
  role: 'assistant';
};

export const isAgentHistoryAssistantItem = (
  i: unknown,
): i is AgentHistoryAssistantItem => {
  return (
    'role' in (i as AgentHistoryAssistantItem) &&
    (i as AgentHistoryAssistantItem).role === 'assistant'
  );
};

export type AgentHistoryErrorItem = {
  error: CodeLlmError;
  role: 'error';
};

export const isAgentHistoryErrorItem = (
  i: unknown,
): i is AgentHistoryErrorItem => {
  return (
    'role' in (i as AgentHistoryErrorItem) &&
    (i as AgentHistoryErrorItem).role === 'error'
  );
};

export type AgentHistoryToolItem = {
  name: string;
  params: ToolRunParamsParams;
  role: 'tool';
};

export const isAgentHistoryToolItem = (
  i: unknown,
): i is AgentHistoryToolItem => {
  return (
    'role' in (i as AgentHistoryToolItem) &&
    (i as AgentHistoryToolItem).role === 'tool'
  );
};

export type AgentHistoryToolResponseItem = {
  content: string;
  name: string;
  role: 'toolResponse';
};

export const isAgentHistoryToolResponseItem = (
  i: unknown,
): i is AgentHistoryToolResponseItem => {
  return (
    'role' in (i as AgentHistoryToolResponseItem) &&
    (i as AgentHistoryToolResponseItem).role === 'toolResponse'
  );
};

export type AgentHistoryUserItem = {
  content: string;
  role: 'user';
};

export const isAgentHistoryUserItem = (
  i: unknown,
): i is AgentHistoryUserItem => {
  return (
    'role' in (i as AgentHistoryUserItem) &&
    (i as AgentHistoryUserItem).role === 'user'
  );
};

export type AgentHistoryItem =
  | AgentHistoryAssistantItem
  | AgentHistoryErrorItem
  | AgentHistoryToolItem
  | AgentHistoryToolResponseItem
  | AgentHistoryUserItem;

export type AgentHistory = AgentHistoryItem[];

export type AgentHistories = Map<string, AgentHistory>;

export type AgentHistoryAddParams =
  | AgentHistoryErrorItem
  | AgentHistoryToolItem
  | AgentHistoryToolResponseItem
  | AgentHistoryUserItem
  | AgentResponseResponse;

export type AgentEmitterChannels = keyof typeof AGENT_EMITTER_CHANNELS;

export type Agent = {
  chat: (message: string) => Promise<AgentResponse>;
  getHistory: () => AgentHistory;
  offEmit: (
    channel: AgentEmitterChannels,
    listener: (params: AgentHistoryItem) => void,
  ) => void;
  onEmit: (
    channel: AgentEmitterChannels,
    listener: (params: AgentHistoryItem) => void,
  ) => void;
};
