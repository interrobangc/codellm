import OpenAI from 'openai';
import {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '../../types.js';
import { OpenaiConfig } from './types.js';

export const getClient = ({ model, config }: ProviderGetClientParams) => {
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
