import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { MistralConfig } from './types';

import MistralClient from '@mistralai/mistralai';

export const newClient = async ({ config, model }: ProviderGetClientParams) => {
  const client = new MistralClient(
    (config as MistralConfig).apiKey,
    (config as MistralConfig).endpoint,
  );

  return {
    chat: async (messages: MessageList) => {
      const response = await client.chat({ messages, model });
      return response?.choices?.[0]?.message.content;
    },
    initModel: async () => {
      // log('mistral availableModels', 'debug', {
      //   models: await client.listModels(),
      // });
    },
    prompt: async ({ prompt, system }: PromptParams) => {
      return `Not implemented yet for OpenAI. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
