import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { MistralConfig } from './types';

import MistralClient from '@mistralai/mistralai';

export const newClient = async ({ model, config }: ProviderGetClientParams) => {
  const client = new MistralClient(
    (config as MistralConfig).apiKey,
    (config as MistralConfig).endpoint,
  );

  return {
    initModel: async () => {
      // log('mistral availableModels', 'debug', {
      //   models: await client.listModels(),
      // });
    },
    chat: async (messages: MessageList) => {
      const response = await client.chat({ model, messages });
      return response?.choices?.[0]?.message.content;
    },
    prompt: async ({ system, prompt }: PromptParams) => {
      return `Not implemented yet for OpenAI. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
