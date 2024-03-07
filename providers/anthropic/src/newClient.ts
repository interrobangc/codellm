import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
// import type { Anthropic as AnthropicTypes } from '@anthropic-ai/sdk';
import type { AnthropicConfig } from './types';

import Anthropic from '@anthropic-ai/sdk';
import { log } from '@codellm/core';

export const newClient = async ({ model, config }: ProviderGetClientParams) => {
  const client = new Anthropic({ apiKey: (config as AnthropicConfig).apiKey });
  return {
    initModel: async () => {
      // log('mistral availableModels', 'debug', {
      //   models: await client.listModels(),
      // });
    },
    chat: async (messages: MessageList) => {
      const request = {
        max_tokens: 1024,
        messages: messages.filter((message) => message.role !== 'system'),
        system: messages.find((message) => message.role === 'system')?.content,
        model,
      };

      log('anthropic chat request', 'debug', { request });
      // @ts-expect-error - `messages` is not typed correctly yet
      const response = await client.messages.create(request);

      return response?.content[0]?.text;
    },
    prompt: async ({ system, prompt }: PromptParams) => {
      return `Not implemented yet for OpenAI. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
