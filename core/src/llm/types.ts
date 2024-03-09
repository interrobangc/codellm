import type { Config, Service } from '@/.';
import type { CHAT_MESSAGE_ROLES_TYPE } from './constants';

export * from './conversation/types.js';

export type Provider = string;

export type ProviderConfig = Record<string, unknown>;

export type ProviderConfigItem = {
  config: ProviderConfig;
  module: string;
};

export type ProviderConfigs = Record<Provider, ProviderConfigItem>;

export type ProviderServiceItem = {
  model: string;
  provider: Provider;
};

export type ChatMessageRole =
  (typeof CHAT_MESSAGE_ROLES_TYPE)[keyof typeof CHAT_MESSAGE_ROLES_TYPE];

export type ChatMessage = {
  content: string;
  role: ChatMessageRole;
};

export type MessageList = ChatMessage[];

export type PromptParams = {
  prompt: string;
  system: string;
};

export type LlmClientCommon = {
  chat: (messages: MessageList) => Promise<string>;
  initModel: () => Promise<void>;
  prompt: (args: PromptParams) => Promise<string>;
};

export type LlmClient = {
  service: Service;
} & LlmClientCommon;

export type LlmProviderClient = LlmClientCommon;

export type Llms = Map<Service, LlmClient>;

export type GetClientParams = {
  config: Config;
  service: Service;
};

export type ProviderGetClientParams = {
  config: ProviderConfig;
  model: string;
};
