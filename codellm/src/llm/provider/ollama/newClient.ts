import { Ollama } from 'ollama';
import type {
  MessageList,
  OllamaConfig,
  PromptParams,
  ProviderGetClientParams,
} from '@/.';
import initModel from './initModel.js';

export const newClient = async ({ model, config }: ProviderGetClientParams) => {
  const client = new Ollama(config as OllamaConfig);

  return {
    initModel: () => initModel(client, model),
    chat: async (messages: MessageList) => {
      const response = await client.chat({ model, messages });
      return response.message.content;
    },
    prompt: async ({ system, prompt }: PromptParams) => {
      const response = await client.generate({ model, system, prompt });
      return response.response;
    },
  };
};
