import type { Agent, Config } from '@/.';
import { getConfig, initConfig } from '@/config/index.js';
import { conversation, initLlms } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { getPrompt } from '@/prompt/index.js';
import { newTool, TOOLS } from '@/tool/index.js';
import chat from './chat.js';

export const newAgent = async (
  configParam: Partial<Config>,
): Promise<Agent> => {
  initConfig(configParam as Config);
  const config = getConfig();

  const llms = await initLlms(config, ['agent', 'tool']);
  log('newAgent LLMs', 'silly', { llms });

  const toolsMap = await Promise.all(
    TOOLS.map(async (toolName) => {
      return {
        [toolName]: await newTool(config, toolName),
      };
    }),
  );

  const tools = Object.assign({}, ...toolsMap);
  log('newAgent Tools', 'silly', { tools });

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
    chat: chat(llms, tools),
  };
};

export default newAgent;
