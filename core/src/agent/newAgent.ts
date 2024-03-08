import type { Agent, PartialConfig } from '@/.';
import { getConfig, initConfig } from '@/config/index.js';
import { isError } from '@/error/index.js';
import { conversation, initLlms } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { initPrompts } from '@/prompt/index.js';
import { initTools } from '@/tool/index.js';
import chat from './chat.js';

/**
 * Create a new agent which is the primary interface to interact with the LLMs
 *
 * @param {PartialConfig} configParam - The configuration to use
 *
 * @returns - The new agent
 */
export const newAgent = async (configParam: PartialConfig) => {
  const initConfigRes = initConfig(configParam);
  if (isError(initConfigRes)) {
    return initConfigRes;
  }
  const config = getConfig();

  const llms = await initLlms(config, ['agent', 'tool']);
  log('newAgent LLMs', 'silly', { llms });

  const tools = await initTools(config);
  log('newAgent tools', 'silly', { tools });

  const prompt = initPrompts({ config, tools });

  conversation.addMessages('agent', [
    {
      role: 'system',
      content: await prompt.get('agentSystem'),
    },
  ]);

  return {
    chat: chat(llms, tools),
  } as Agent;
};

export default newAgent;
