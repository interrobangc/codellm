import type { ConversationHistory, MessageList, Service } from '@/.';
import { SERVICES } from '@/config/constants.js';

const conversationHistory: ConversationHistory = SERVICES.reduce(
  (acc, service) => ({ ...acc, [service]: [] }),
  {} as ConversationHistory,
);

export const getHistory = (service: Service) =>
  conversationHistory[service] as MessageList;

export const addMessages = (service: Service, messages: MessageList) => {
  conversationHistory[service] = [...conversationHistory[service], ...messages];
};
