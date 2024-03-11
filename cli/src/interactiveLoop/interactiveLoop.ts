import type { Agent } from '@codellm/core';
import ora from 'ora';
import { isError, log } from '@codellm/core';

import { promptUser } from './promptUser.js';

type InteractiveLoop = (agent: Agent) => Promise<void>;

export const handleQuestion = async (agent: Agent) => {
  const question = await promptUser(`[user] `);

  const spinner = ora('Considering...').start();
  const response = await agent.chat(question);
  spinner.stop();

  if (isError(response)) {
    log('Agent response error', 'error', { response });
  } else {
    log('Agent response', 'debug', { response });
    // eslint-disable-next-line no-console
    console.log(`[bot] ${response.content}`);
  }
};

export const interactiveLoop: InteractiveLoop = async (agent) => {
  await handleQuestion(agent);
  return interactiveLoop(agent);
};

export default interactiveLoop;
