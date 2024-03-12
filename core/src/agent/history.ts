import type { AgentHistory, AgentHistoryAddParams } from '@/.';
import {
  agentResponseResponseSchema,
  isAgentHistoryUserItem,
} from '@/agent/types.js';
import { CodeLlmError } from '@/error/index.js';

const agentHistory: AgentHistory = [];

export const getHistory = () => agentHistory;

export const addToHistory = (params: AgentHistoryAddParams) => {
  try {
    const validAgentResponse = agentResponseResponseSchema.parse(params);
    const { code, content, reason } = validAgentResponse;
    return agentHistory.push({
      code,
      content,
      reason,
      role: 'assistant',
    });
  } catch (error) {
    // ignore
  }

  if (!isAgentHistoryUserItem(params)) {
    return new CodeLlmError({ code: 'agent:addHistory', meta: { params } });
  }

  return agentHistory.push(params);
};
