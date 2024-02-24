import { Ollama } from 'ollama'
import initModel from './initModel.js'


export const getClient = async (model: string, config = {
  host: 'http://localhost:11434'
}) => {
  const client = new Ollama(config)


  return {
    initModel: () => initModel(client, model),
    chat: async (role:string, content: string) => {
      const response = await client.chat({model, messages: [{role, content}]})
      return response.message.content
    }
  }
}