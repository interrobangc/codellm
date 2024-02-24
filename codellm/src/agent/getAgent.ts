import type { CodeLlmConfig } from '../config/types.js'
import type { CodeLlmAgent, CodeLlmLlms } from './types.js'

import { setConfig, getConfig } from '../config/index.js'
import chat from './chat.js'
import { getClient } from '../llm/index.js'

export const getAgent = async (newConfig: CodeLlmConfig): Promise<CodeLlmAgent> => {
  setConfig(newConfig);
  const config = getConfig();

  const llms: CodeLlmLlms = {
    agent: await getClient({config, service: 'agent'})
  }

  Object.entries(llms).map(async ([, client]) => {
    await client.initModel();
  });

  return {
    chat: chat(llms)
  }
}

export default getAgent;