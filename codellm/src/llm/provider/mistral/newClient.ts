import MistralClient from '@mistralai/mistralai';
import type {
  MessageList,
  MistralConfig,
  PromptParams,
  ProviderGetClientParams,
} from '@/.';

// import log from '@/log/index.js';

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
