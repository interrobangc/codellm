import type { ToolName } from '../tool/types.js';

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

export type AgentResponseResponse = {
  type: 'response';
  content: string;
  code?: AgentResponseCodeItemList;
};

export const isAgentResponseResponse = (
  i: AgentResponseResponse,
): i is AgentResponseResponse => {
  return i.type === 'response';
};

export type AgentToolResponse = {
  type: 'tool';
  reason: string;
  name: ToolName;
  query: string;
  parameters: Record<string, unknown>;
};

export const isAgentToolResponse = (
  i: AgentSelectToolResponse,
): i is AgentToolResponse => {
  return i.type === 'tool';
};

export type AgentSelectToolResponse =
  | AgentErrorResponse
  | AgentResponseResponse
  | AgentToolResponse;

export type AgentResponse = AgentErrorResponse | AgentResponseResponse;
