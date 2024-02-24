import { Ollama } from 'ollama';
import { MessageList } from '../../types.js';
import { ProviderGetClientParams, PromptParams } from '../../types.js';
import initModel from './initModel.js';
import { OllamaConfig } from './types.js';

export const getClient = async ({ model, config }: ProviderGetClientParams) => {
  const client = new Ollama(config as OllamaConfig);

  return {
    initModel: () => initModel(client, model),
    chat: async (messages: MessageList) => {
      const response = await client.chat({ model, messages });
      return response.message.content;
    },
    prompt: async ({ system, prompt }: PromptParams) => {
      console.log('prompt', { model, system, prompt });
      const response = await client.generate({ model, system, prompt });
      console.log('prompt response', response.response);
      return response.response;
    },
  };
};
