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

export type PromptParams = {
  system: string;
  prompt: string;
};

export type LlmClientCommon = {
  initModel: () => Promise<void>;
  chat: (messages: MessageList) => Promise<string>;
  prompt: (args: PromptParams) => Promise<string>;
};

export type LlmClient = {
  service: Service;
} & LlmClientCommon;

export type LlmProviderClient = LlmClientCommon;

export type Llms = Record<Service, LlmClient>;

export type GetClientParams = {
  config: Config;
  service: Service;
};

export type ProviderGetClientParams = {
  model: string;
  config: ProviderConfig;
};
