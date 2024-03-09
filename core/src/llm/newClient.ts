import type {
  Config,
  GetClientParams,
  LlmProviderClient,
  MessageList,
  PromptParams,
  Provider,
  Service,
} from '@/.';

import { CodeLlmError, isError } from '@/error/index.js';
import log from '@/log/index.js';
import * as conversation from './conversation/index.js';

/**
 * Initialize the underlying provider/model for a given service
 *
 * @param client - The LLM provider client to use
 */
export const initModel = async (client: LlmProviderClient): Promise<void> => {
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
): Promise<string> => {
  // We need to send the full conversation history to the provider
  // to ensure that the provider has all the context it needs to generate a response
  conversation.addMessages(service, messages);

  log('conversationHistoryBeforeChat', 'silly', {
    history: conversation.getHistory(service),
  });
  log('llmChat send', 'debug', { service, messages });
  const response = await client.chat(conversation.getHistory(service));
  log('llmChat receive', 'debug', { service, response });

  // We also need to add the response to the conversation history to ensure that
  // the next message has the full context including the response
  conversation.addMessages(service, [{ role: 'assistant', content: response }]);

  log('conversationHistoryAfterChat', 'silly', {
    history: conversation.getHistory(service),
  });

  return response;
};

/**
 * Import the provider module for a given provider
 *
 * @param provider - The provider to import
 *
 * @returns - The provider module
 */
const getClient = async (config: Config, provider: Provider) => {
  const providerConfigItem = config.providers[provider];

  if (!providerConfigItem) {
    return new CodeLlmError({
      code: 'llm:invalidProvider',
      meta: { provider },
    });
  }

  const { config: providerConfig, module } = providerConfigItem;

  return {
    providerModule: await import(module),
    providerConfig,
  };
};

/**
 * Create a new client for a given service
 *
 * @param config - The configuration to use
 * @param service - The service to use
 *
 * @returns - The new client
 */
export const newClient = async ({ config, service }: GetClientParams) => {
  const { model, provider } = config.llms[service];

  const getClientRes = await getClient(config, provider);
  if (isError(getClientRes)) {
    return getClientRes;
  }
  const { providerModule, providerConfig } = getClientRes;

  const client = await providerModule.newClient({
    config: providerConfig,
    model,
  });

  return {
    service,
    initModel: () => initModel(client),
    chat: async (messages: MessageList) => chat(service, client, messages),
    prompt: async (params: PromptParams) => client.prompt(params),
  };
};
