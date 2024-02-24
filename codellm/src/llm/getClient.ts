import type { CodeLlmConfig, CodeLlmServices } from '..'
import { CodeLlmClient } from './types.js'
import * as ollama from './providers/ollama/index.js'
import * as openai from './providers/openai/index.js'

export type GetClientParams = {
  config: CodeLlmConfig,
  service: CodeLlmServices,
}

export const getClient = async ({config, service}: GetClientParams): Promise<CodeLlmClient> => {
  const {model, provider} = config.llms[service]

  switch (provider) {
    case 'ollama':
      return ollama.getClient(model)
    case 'openai':
      return openai.getClient(model)
    default:
      throw new Error(`Invalid provider: ${provider}`)
  }
}