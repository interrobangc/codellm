import type { Agent } from '@interrobangc/codellm';
import ora from 'ora';
import { log } from '@interrobangc/codellm';

import { promptUser } from './promptUser.js';

type InteractiveLoop = (agent: Agent) => Promise<void>;

export const interactiveLoop: InteractiveLoop = async (agent) => {
  const question = await promptUser(`[user] `);

  const spinner = ora('Considering...').start();
  const response = await agent.chat(question);
  spinner.stop();

  log('Agent response', 'debug', { response });

  // eslint-disable-next-line no-console
  console.log(`[bot] ${response.content}`);

  return interactiveLoop(agent);
};

export default interactiveLoop;
