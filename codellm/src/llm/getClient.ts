import { Service } from '../config/types.js';
import { Client, GetClientParams, LlmClient, MessageList } from './types';
import * as ollama from './provider/ollama/index.js';
import * as openai from './provider/openai/index.js';
import * as conversation from './conversation/index.js';

export const initModel = async (client: LlmClient): Promise<void> => {
  await client.initModel();
};

export const chat = async (
  service: Service,
  client: LlmClient,
  messages: MessageList,
): Promise<string> => {
  conversation.addMessages(service, messages);
  console.log('chat', conversation.getHistory(service));
  const response = await client.chat(conversation.getHistory(service));
  conversation.addMessages(service, [{ role: 'assistant', content: response }]);

  return response;
};

export const getClient = async ({
  config,
  service,
}: GetClientParams): Promise<Client> => {
  const { model, provider } = config.llms[service];

  let client: LlmClient;
  switch (provider) {
    case 'ollama':
      client = await ollama.getClient({ model, config: {} });
      break;
    case 'openai':
      client = openai.getClient({ model, config: {} });
      break;
    default:
      throw new Error(`Invalid provider: ${provider}`);
  }

  return {
    service,
    initModel: () => initModel(client),
    chat: async (messages: MessageList) => chat(service, client, messages),
  };
};
