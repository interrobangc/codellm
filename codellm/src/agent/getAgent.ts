import type { Config } from '../config/types';
import { setConfig, getConfig } from '../config/index.js';
import { conversation, initLlms } from '../llm/index.js';
import { getPrompt } from '../prompt/index.js';

import chat from './chat.js';
import type { Agent } from './types';

export const getAgent = async (newConfig: Config): Promise<Agent> => {
  setConfig(newConfig);
  const config = getConfig();

  console.log(config);

  const llms = await initLlms(config);

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
