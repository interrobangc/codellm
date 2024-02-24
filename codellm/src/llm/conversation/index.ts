import { Service, services } from '../../config/types.js';
import { MessageList } from '../types.js';
import { ConversationHistory } from './types.js';

const conversationHistory: ConversationHistory = services.reduce(
  (acc, service) => ({ ...acc, [service]: [] }),
  {} as ConversationHistory,
);

export const getHistory = (service: Service): MessageList =>
  conversationHistory[service];

export const addMessages = (service: Service, messages: MessageList): void => {
  conversationHistory[service] = [...conversationHistory[service], ...messages];
};
