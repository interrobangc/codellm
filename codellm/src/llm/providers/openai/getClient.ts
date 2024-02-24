import {CodeLlmMessageList} from '../../types.js'
// import OpenAI, {ClientOptions} from 'openai';


export const getClient = (model: string) => {
  // const client = new OpenAI(config)

  return {
    initModel: async () => {},
    chat: async (messages: CodeLlmMessageList) => {
      return `OpenAI chat: ${messages} ${model}`
    }
  }
}