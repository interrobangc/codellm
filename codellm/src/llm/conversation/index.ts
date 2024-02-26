import type { ConversationHistory, MessageList, Service } from '@/.';
import { SERVICES } from '@/config/constants.js';

const conversationHistory: ConversationHistory = SERVICES.reduce(
  (acc, service) => ({ ...acc, [service]: [] }),
  {} as ConversationHistory,
);

export const getHistory = (service: Service): MessageList =>
  conversationHistory[service];

export const addMessages = (service: Service, messages: MessageList): void => {
  conversationHistory[service] = [...conversationHistory[service], ...messages];
};
