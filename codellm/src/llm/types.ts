import { Config, Service } from '../config/types.js';

const CHAT_MESSAGE_ROLES = {
  assistant: 'assistant',
  system: 'system',
  user: 'user',
} as const;

export type ChatMessageRole =
  (typeof CHAT_MESSAGE_ROLES)[keyof typeof CHAT_MESSAGE_ROLES];

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
};

export type MessageList = ChatMessage[];

export type ClientCommon = {
  initModel: () => Promise<void>;
  chat: (messages: MessageList) => Promise<string>;
};

export type Client = {
  service: Service;
} & ClientCommon;

export type LlmClient = ClientCommon;

export type Llms = Record<Service, Client>;

export type GetClientParams = {
  config: Config;
  service: Service;
};

export type ProviderGetClientParams = {
  model: string;
  config?: Record<string, unknown>;
};
