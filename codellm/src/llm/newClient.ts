import { Service } from '../config/types.js';
import log from '../log/index.js';
import {
  LlmClient,
  GetClientParams,
  LlmProviderClient,
  MessageList,
  PromptParams,
  PROVIDER_MODULES,
} from './types.js';

import * as conversation from './conversation/index.js';

export const initModel = async (client: LlmProviderClient): Promise<void> => {
  await client.initModel();
};

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

export const newClient = async ({
  config,
  service,
}: GetClientParams): Promise<LlmClient> => {
  const { model, provider } = config.llms[service];

  const providerModule = PROVIDER_MODULES[provider];
  if (!providerModule) throw new Error(`Provider not found: ${provider}`);

  const client = await providerModule.newClient({
    model,
    config: config.providers[provider],
  });

  return {
    service,
    initModel: () => initModel(client),
    chat: async (messages: MessageList) => chat(service, client, messages),
    prompt: async (params: PromptParams) => client.prompt(params),
  };
};
