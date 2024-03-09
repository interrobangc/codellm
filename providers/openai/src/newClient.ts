import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { OpenaiConfig } from './types';

import OpenAI from 'openai';

export const newClient = ({ config, model }: ProviderGetClientParams) => {
  const client = new OpenAI(config as OpenaiConfig);

  return {
    chat: async (messages: MessageList) => {
      const response = await client.chat.completions.create({
        messages,
        model,
      });

      return response.choices?.[0]?.message.content ?? '';
    },
    initModel: async () => {},
    prompt: async ({ prompt, system }: PromptParams) => {
      return `Not implemented yet for OpenAI. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
