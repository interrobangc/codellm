import { Ollama } from 'ollama'
import {CodeLlmMessageList} from '../../types.js'
import initModel from './initModel.js'


export const getClient = async (model: string, config = {
  host: 'http://localhost:11434'
}) => {
  const client = new Ollama(config)

  return {
    initModel: () => initModel(client, model),
    chat: async (messages: CodeLlmMessageList) => {
      const response = await client.chat({model, messages})
      return response.message.content
    }
  }
}