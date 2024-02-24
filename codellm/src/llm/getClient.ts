import type { CodeLlmConfig, CodeLlmService } from '..'
import { CodeLlmClient, CodeLlmMessageList } from './types'
import * as ollama from './providers/ollama/index.js'
import * as openai from './providers/openai/index.js'

export type GetClientParams = {
  config: CodeLlmConfig,
  service: CodeLlmService,
}

export const initModel = async (client: CodeLlmClient): Promise<void> => {
  return client.initModel()
}

export const chat = async (client: CodeLlmClient, messages: CodeLlmMessageList): Promise<string> => {
  console.log('chat', messages)
  return client.chat(messages)
}

export const getClient = async ({config, service}: GetClientParams): Promise<CodeLlmClient> => {
  const {model, provider} = config.llms[service]

  let client: CodeLlmClient;
  switch (provider) {
    case 'ollama':
      client = await ollama.getClient(model)
      break
    case 'openai':
      client = openai.getClient(model)
      break
    default:
      throw new Error(`Invalid provider: ${provider}`)
  }

  return {
    initModel: () => initModel(client),
    chat: async (messages: CodeLlmMessageList) => chat(client, messages),
  }
}