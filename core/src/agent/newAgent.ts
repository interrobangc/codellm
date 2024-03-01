import type { Agent, PartialConfig, Tools } from '@/.';
import { getConfig, initConfig } from '@/config/index.js';
import { conversation, initLlms } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { getPrompt } from '@/prompt/index.js';
import { initTools } from '@/tool/index.js';
import chat from './chat.js';

export const getToolDescriptions = (tools: Tools = {}) => {
  return JSON.stringify(Object.values(tools).map((tool) => tool.description));
};

/**
 * Create a new agent which is the primary interface to interact with the LLMs
 *
 * @param {PartialConfig} configParam - The configuration to use
 *
 * @returns - The new agent
 */
export const newAgent = async (configParam: PartialConfig): Promise<Agent> => {
  initConfig(configParam);
  const config = getConfig();

  const llms = await initLlms(config, ['agent', 'tool']);
  log('newAgent LLMs', 'silly', { llms });

  const tools = await initTools(config);
  log('newAgent tools', 'silly', { tools });

  conversation.addMessages('agent', [
    {
      role: 'system',
      content: `
        ${getPrompt('agent')}
        ${getPrompt('selectTool')}
        ${getToolDescriptions(tools)}
      `,
    },
  ]);

  return {
    chat: chat(llms, tools),
  };
};

export default newAgent;
