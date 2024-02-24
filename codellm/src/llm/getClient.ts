import { Service } from '../config/types.js';
import {
  Client,
  GetClientParams,
  LlmClient,
  MessageList,
  PromptParams,
  PROVIDER_MODULES,
} from './types.js';

import * as conversation from './conversation/index.js';

export const initModel = async (client: LlmClient): Promise<void> => {
  await client.initModel();
};

export const chat = async (
  service: Service,
  client: LlmClient,
  messages: MessageList,
): Promise<string> => {
  // We need to send the full conversation history to the provider
  // to ensure that the provider has all the context it needs to generate a response
  conversation.addMessages(service, messages);
  console.log('chat', conversation.getHistory(service));
  const response = await client.chat(conversation.getHistory(service));

  // We also need to add the response to the conversation history to ensure that
  // the next message has the full context including the response
  conversation.addMessages(service, [{ role: 'assistant', content: response }]);

  return response;
};

export const getClient = async ({
  config,
  service,
}: GetClientParams): Promise<Client> => {
  const { model, provider } = config.llms[service];

  let client: LlmClient;

  const providerModule = PROVIDER_MODULES[provider];
  if (providerModule) {
    client = await providerModule.getClient({
      model,
      config: config.providers[provider],
    });
  } else {
    throw new Error(`Provider not found: ${provider}`);
  }

  return {
    service,
    initModel: () => initModel(client),
    chat: async (messages: MessageList) => chat(service, client, messages),
    prompt: async (params: PromptParams) => client.prompt(params),
  };
};
