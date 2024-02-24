import { MessageList, ProviderGetClientParams } from '../../types.js';
// import OpenAI, {ClientOptions} from 'openai';

export const getClient = ({ model, config }: ProviderGetClientParams) => {
  // const client = new OpenAI(config)

  return {
    initModel: async () => {},
    chat: async (messages: MessageList) => {
      return `OpenAI chat: ${messages} ${model}, ${config}`;
    },
  };
};
