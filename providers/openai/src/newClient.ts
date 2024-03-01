import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { OpenaiConfig } from './types';

import OpenAI from 'openai';

export const newClient = ({ model, config }: ProviderGetClientParams) => {
  const client = new OpenAI(config as OpenaiConfig);

  return {
    initModel: async () => {},
    chat: async (messages: MessageList): Promise<string> => {
      const response = await client.chat.completions.create({
        model,
        messages,
      });

      return response.choices?.[0]?.message.content ?? '';
    },
    prompt: async ({ system, prompt }: PromptParams): Promise<string> => {
      return `Not implemented yet for OpenAI. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
