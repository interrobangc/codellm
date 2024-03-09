import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { OllamaConfig } from './types';

import { Ollama } from 'ollama';
import initModel from './initModel.js';

export const newClient = async ({ config, model }: ProviderGetClientParams) => {
  const client = new Ollama(config as OllamaConfig);

  return {
    chat: async (messages: MessageList) => {
      const response = await client.chat({ messages, model });
      return response.message.content;
    },
    initModel: () => initModel(client, model),
    prompt: async ({ prompt, system }: PromptParams) => {
      const response = await client.generate({ model, prompt, system });
      return response.response;
    },
  };
};
