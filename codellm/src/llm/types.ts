import { Config, Service } from '../config/types.js';
import * as ollama from './provider/ollama/index.js';
import * as openai from './provider/openai/index.js';

export const PROVIDERS = {
  ollama: 'ollama',
  openai: 'openai',
} as const;

export const PROVIDER_MODULES = {
  ollama,
  openai,
} as const;

export type Provider = (typeof PROVIDERS)[keyof typeof PROVIDERS];

export type ProviderItem = {
  provider: Provider;
  model: string;
};

export type ProviderConfig = ollama.OllamaConfig | openai.OpenaiConfig;

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
  config: ProviderConfig;
};
