import type { Agent, PartialConfig } from '@/.';
import { initConfig } from '@/config/index.js';
import { isError } from '@/error/index.js';
import { conversation, initLlms } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { initPrompts } from '@/prompt/index.js';
import { initTools } from '@/tool/index.js';
import chat from './chat.js';
import { off, on } from './emitter.js';
import { clearHistory, getHistory } from './history.js';

/**
 * Create a new agent which is the primary interface to interact with the LLMs
 *
 * @param {PartialConfig} configParam - The configuration to use
 *
 * @returns - The new agent
 */
export const newAgent = async (configParam: PartialConfig) => {
  const initConfigRes = initConfig(configParam);
  if (isError(initConfigRes)) return initConfigRes;

  const llms = await initLlms(['agent', 'tool']);
  if (isError(llms)) return llms;

  log('newAgent LLMs', 'silly', { llms });

  const tools = await initTools();
  if (isError(tools)) return tools;

  log('newAgent tools', 'silly', { tools });

  const prompt = initPrompts();
  if (isError(prompt)) return prompt;

  const content = await prompt.get('agentSystem');
  if (isError(content)) return content;

  clearHistory();
  conversation.clearHistory('agent');
  conversation.addMessages('agent', [
    {
      content,
      role: 'system',
    },
  ]);

  return {
    chat,
    getHistory: () => getHistory(),
    offEmit: off,
    onEmit: on,
  } as Agent;
};

export default newAgent;
