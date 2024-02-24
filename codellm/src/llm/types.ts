import {CodeLlmService } from '../config/types.js';

const CHAT_MESSAGE_ROLES = {
  agent: 'agent',
  system: 'system',
  user: 'user',
} as const;

export type CodeLlmChatMessageRole = typeof CHAT_MESSAGE_ROLES[keyof typeof CHAT_MESSAGE_ROLES];

export type CodeLlmChatMessage = {
  role: CodeLlmChatMessageRole;
  content: string;
};

export type CodeLlmMessageList = CodeLlmChatMessage[];

export type CodeLlmClient = {
  initModel: () => Promise<void>;
  chat: (messages: CodeLlmMessageList) => Promise<string>;
};

export type CodeLlmLlms = Record<CodeLlmService, CodeLlmClient>