import type { Config, Service } from '@/.';
import type { CHAT_MESSAGE_ROLES_TYPE } from './constants';

export * from './conversation/types.js';

export type Provider = string;

export type ProviderConfig = Record<string, unknown>;

export type ProviderConfigItem = {
  module: string;
  config: ProviderConfig;
};

export type ProviderConfigs = Record<Provider, ProviderConfigItem>;

export type ProviderServiceItem = {
  provider: Provider;
  model: string;
};

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

export type Llms = Map<Service, LlmClient>;

export type GetClientParams = {
  config: Config;
  service: Service;
};

export type ProviderGetClientParams = {
  model: string;
  config: ProviderConfig;
};
