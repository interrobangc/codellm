import type { ConversationHistory, MessageList, Service } from '@/.';
import { CodeLlmError, isError } from '@/error/index.js';

const conversationHistory: ConversationHistory = new Map();

export const getHistory = (service: Service) => {
  const history = conversationHistory.get(service);
  if (!history)
    return new CodeLlmError({
      code: 'llm:noConversationHistory',
      meta: { service },
    });
  return history;
};

export const addMessages = (service: Service, messages: MessageList) => {
  let history = conversationHistory.get(service);
  if (isError(history, 'llm:noConversationHistory')) history = [];
  if (isError(history)) return history;
  if (!history) return history;

  conversationHistory.set(service, [...history, ...messages]);

  return conversationHistory.get(service);
};

export const clearHistory = (service: Service) => {
  conversationHistory.set(service, []);
};
