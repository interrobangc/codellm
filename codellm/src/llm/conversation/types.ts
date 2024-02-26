import type { MessageList, Service } from '@/.';

export type ConversationHistory = Record<Service, MessageList>;
