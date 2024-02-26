import type { Config, OllamaConfig, OpenaiConfig, Service } from '@/.';
import type { CHAT_MESSAGE_ROLES_TYPE, PROVIDERS_TYPE } from './constants';

export * from './conversation/types.js';
export * from './provider/ollama/types.js';
export * from './provider/openai/types.js';

export type Provider = (typeof PROVIDERS_TYPE)[keyof typeof PROVIDERS_TYPE];

export type ProviderItem = {
  provider: Provider;
  model: string;
};

export type ProviderConfig = OllamaConfig | OpenaiConfig;

export type ChatMessageRole =
  (typeof CHAT_MESSAGE_ROLES_TYPE)[keyof typeof CHAT_MESSAGE_ROLES_TYPE];

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
