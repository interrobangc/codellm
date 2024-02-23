import type { CodeLlmConfig } from '../config/types'
import type { CodeLlmAgent } from './types'

import { setConfig } from '../config'
import chat from './chat'

export const getAgent = async (config: CodeLlmConfig): Promise<CodeLlmAgent> => {
  setConfig(config);

  return {
    chat
  }
}

export default getAgent;