import type {
  MessageList,
  PromptParams,
  ProviderGetClientParams,
} from '@codellm/core';
import type { LangchainConfig } from './types';
import {
  AIMessage,
  // BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { log } from '@codellm/core';

export const getLangchainClient = async (
  model: string,
  config: LangchainConfig,
) => {
  const { chatClass: chatClassName, module: modulePath } = config;

  const chatModule = await import(modulePath);

  const chatClass = chatModule[chatClassName];

  return new chatClass({ ...config.config, modelName: model });
};

export const transformCodeLlmMessages = (messages: MessageList) => {
  const roleMap = {
    assistant: AIMessage,
    system: SystemMessage,
    user: HumanMessage,
  };

  return messages.map((message) => {
    return new roleMap[message.role](message.content);
  });
};

export const newClient = async ({ config, model }: ProviderGetClientParams) => {
  const client = await getLangchainClient(model, config as LangchainConfig);

  return {
    chat: async (messages: MessageList) => {
      const response = await client.invoke(transformCodeLlmMessages(messages));

      log('langchain chat response', 'debug', response);

      return response?.content;
    },
    initModel: async () => {},
    prompt: async ({ prompt, system }: PromptParams) => {
      return `Not implemented yet for langchain. System: ${system}, Prompt: ${prompt}`;
    },
  };
};
