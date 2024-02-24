import type { Config } from '../config/types';
import { setConfig, getConfig } from '../config/index.js';
import { conversation, initLlms } from '../llm/index.js';
import { getPrompt } from '../prompt/index.js';

import chat from './chat.js';
import type { Agent } from './types';

export const getAgent = async (configParam: Config): Promise<Agent> => {
  setConfig(configParam);
  const config = getConfig();

  const llms = await initLlms(config, ['agent']);

  conversation.addMessages('agent', [
    {
      role: 'system',
      content: `
        ${getPrompt('agent')}
        ${getPrompt('selectTool')}
        ${getPrompt('toolList')}
      `,
    },
  ]);

  return {
    chat: chat(llms),
  };
};

export default getAgent;
