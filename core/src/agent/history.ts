import type { AgentHistory, AgentHistoryAddParams } from '@/.';
import {
  agentResponseResponseSchema,
  isAgentResponseResponse,
} from '@/agent/types.js';
import { CodeLlmError } from '@/error/index.js';
import { emit } from '@/agent/emitter.js';

const agentHistory: AgentHistory = [];

export const getHistory = () => agentHistory;

export const addToHistory = (params: AgentHistoryAddParams) => {
  try {
    const validAgentResponse = agentResponseResponseSchema.parse(params);
    const { code, content, reason } = validAgentResponse;
    const historyItem = {
      code,
      content,
      reason,
      role: 'assistant',
    } as const;
    emit(historyItem);
    return agentHistory.push(historyItem);
  } catch (error) {
    // ignore
  }

  if (isAgentResponseResponse(params)) {
    return new CodeLlmError({ code: 'agent:addHistory', meta: { params } });
  }

  emit(params);
  return agentHistory.push(params);
};

export const clearHistory = () => {
  agentHistory.length = 0;
};
