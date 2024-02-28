import type { Agent, PartialConfig } from '@/.';
import { getConfig, initConfig } from '@/config/index.js';
import { initLlms } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { initTools } from '@/tool/index.js';
import chat from './chat.js';

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

  return {
    chat: chat(llms, tools),
  };
};

export default newAgent;
