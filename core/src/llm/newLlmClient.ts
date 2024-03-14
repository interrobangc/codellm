import type {
  GetClientParams,
  LlmProviderClient,
  MessageList,
  PromptParams,
  Service,
} from '@/.';

import {
  CodeLlmError,
  isError,
  mayFail,
  promiseMayFail,
} from '@/error/index.js';
import { log } from '@/log/index.js';
import * as conversation from './conversation/index.js';
import { llmProviderClientSchema } from './types.js';
import { importClient } from './importClient.js';
/**
 * Initialize the underlying provider/model for a given service
 *
 * @param client - The LLM provider client to use
 */
export const initModel = async (client: LlmProviderClient) => {
  await client.initModel();
};

/**
 * Parent function for chat functionality handled by an individual provider
 *
 * @param service - The service to interact with
 * @param client - The LLM provider client to use
 * @param messages - The messages to send
 *
 * @returns - A normalized response from the provider
 */
export const chat = async (
  service: Service,
  client: LlmProviderClient,
  messages: MessageList,
) => {
  log('llmChat send', 'debug', { messages, service });

  // We need to send the full conversation history to the provider
  // to ensure that the provider has all the context it needs to generate a response
  conversation.addMessages(service, messages);

  let history = conversation.getHistory(service);
  if (isError(history, 'llm:noConversationHistory')) history = [];
  if (isError(history)) return history;

  log('conversationHistoryBeforeChat', 'silly', {
    history,
  });

  const response = await client.chat(history);
  log('llmChat receive', 'debug', { response, service });

  if (isError(response)) return response;

  // We also need to add the response to the conversation history to ensure that
  // the next message has the full context including the response
  conversation.addMessages(service, [
    { content: response as string, role: 'assistant' },
  ]);

  log('conversationHistoryAfterChat', 'silly', {
    history: conversation.getHistory(service),
  });

  return response;
};

/**
 * Create a new client for a given service
 *
 * @param config - The configuration to use
 * @param service - The service to use
 *
 * @returns - The new client
 */
export const newLlmClient = async (
  { config, service }: GetClientParams,
  defaultType: string,
) => {
  const llmConfig = config.llms[service] ?? config.llms[defaultType];
  if (!llmConfig) {
    return new CodeLlmError({
      code: 'llm:noServiceConfig',
      meta: { defaultType, service },
    });
  }
  const { model, provider } = llmConfig;

  const providerConfigEntry = config.providers[provider];
  if (!providerConfigEntry) {
    return new CodeLlmError({
      code: 'llm:noProviderConfig',
      meta: { provider, service },
    });
  }

  const importRes = await importClient(config, provider);
  if (isError(importRes)) return importRes;

  const { providerConfig, providerModule } = importRes;

  const client = await promiseMayFail(
    providerModule.newClient({
      config: providerConfig,
      model,
    }),
    'llm:newLlmProviderClient',
    {
      config,
      model,
      providerConfigEntry,
      service,
    },
  );
  if (isError(client)) return client;

  const validatedClient = mayFail(
    () => llmProviderClientSchema.parse(client),
    'llm:validateClient',
    {
      client,
      service,
    },
  );
  if (isError(validatedClient)) return validatedClient;

  return {
    chat: async (messages: MessageList) =>
      chat(service, validatedClient, messages),
    initModel: () => initModel(validatedClient),
    prompt: async (params: PromptParams) => validatedClient.prompt(params),
    service,
  };
};
