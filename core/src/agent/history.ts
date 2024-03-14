import type { AgentHistories, AgentHistoryAddParams } from '@/.';
import {
  agentResponseResponseSchema,
  isAgentResponseResponse,
} from '@/agent/types.js';
import { CodeLlmError, isError } from '@/error/index.js';
import { getEmitter } from '@/agent/emitter.js';

const agentHistories: AgentHistories = new Map();

export const addToHistory = (id: string, params: AgentHistoryAddParams) => {
  const emitter = getEmitter(id);
  if (isError(emitter)) {
    return emitter;
  }
  try {
    const validAgentResponse = agentResponseResponseSchema.parse(params);
    const { code, content, reason } = validAgentResponse;
    const historyItem = {
      code,
      content,
      reason,
      role: 'assistant',
    } as const;
    emitter.emit(historyItem);
    return agentHistories.set(id, [
      ...(agentHistories.get(id) || []),
      historyItem,
    ]);
  } catch (error) {
    // ignore
  }

  if (isAgentResponseResponse(params)) {
    return new CodeLlmError({ code: 'agent:addHistory', meta: { params } });
  }

  emitter.emit(params);
  const historyItem = [...(agentHistories.get(id) || []), params];
  return agentHistories.set(id, historyItem);
};

export const clearHistory = () => {
  agentHistories.clear();
};

export const getHistories = () => agentHistories;

export const getHistory = (id: string) => {
  return agentHistories.get(id) || [];
};
