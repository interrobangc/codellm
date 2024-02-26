import OpenAI from 'openai';
import type {
  MessageList,
  OpenaiConfig,
  PromptParams,
  ProviderGetClientParams,
} from '@/.';

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
