import type { CodeLlmConfig } from '../config/types'
import { setConfig, getConfig } from '../config/index.js'
import { initLlms } from '../llm/index.js'

import chat from './chat.js'
import type { CodeLlmAgent } from './types'

export const getAgent = async (newConfig: CodeLlmConfig): Promise<CodeLlmAgent> => {
  setConfig(newConfig);
  const config = getConfig();

  console.log(config)

  const llms = await initLlms(config);

  return {
    chat: chat(llms)
  }
}

export default getAgent;