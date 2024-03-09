import type { Config, Service } from '@/.';

import { z } from 'zod';
import { serviceSchema } from '@/config/types.js';
import { getEnumConstValues } from '@/type/index.js';
import { CHAT_MESSAGE_ROLES_TYPE } from './constants.js';

export * from './conversation/types.js';

export const providerSchema = z.string();
export type Provider = z.infer<typeof providerSchema>;

export const providerConfigSchema = z.record(z.unknown());
export type ProviderConfig = z.infer<typeof providerConfigSchema>;

export const providerConfigItemSchema = z.object({
  config: providerConfigSchema,
  module: z.string(),
});
export type ProviderConfigItem = z.infer<typeof providerConfigItemSchema>;

export const providerConfigsSchema = z.record(providerConfigItemSchema);
export type ProviderConfigs = z.infer<typeof providerConfigsSchema>;

export const providerServiceItemSchema = z.object({
  model: z.string(),
  provider: providerSchema,
});
export type ProviderServiceItem = z.infer<typeof providerServiceItemSchema>;

export const chatMessageRoleSchema = z.enum(
  getEnumConstValues(CHAT_MESSAGE_ROLES_TYPE),
);
export type ChatMessageRole = z.infer<typeof chatMessageRoleSchema>;

export const chatMessageSchema = z.object({
  content: z.string(),
  role: chatMessageRoleSchema,
});
export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const messageListSchema = z.array(chatMessageSchema);
export type MessageList = z.infer<typeof messageListSchema>;

export const promptParamsSchema = z.object({
  prompt: z.string(),
  system: z.string(),
});
export type PromptParams = z.infer<typeof promptParamsSchema>;

export const llmProviderClientSchema = z.object({
  chat: z.function(z.tuple([messageListSchema])).returns(z.promise(z.string())),
  initModel: z.function().returns(z.promise(z.void())),
  prompt: z
    .function(z.tuple([promptParamsSchema]))
    .returns(z.promise(z.string())),
});
export type LlmProviderClient = z.infer<typeof llmProviderClientSchema>;

export const llmClientSchema = llmProviderClientSchema.extend({
  service: serviceSchema,
});
export type LlmClient = z.infer<typeof llmClientSchema>;

export type Llms = Map<Service, LlmClient>;

export type GetClientParams = {
  config: Config;
  service: Service;
};

export type ProviderGetClientParams = {
  config: ProviderConfig;
  model: string;
};
