import type { Agent } from '@interrobangc/codellm';
import ora from 'ora';

import { promptUser } from './promptUser.js';

type InteractiveLoop = (agent: Agent) => Promise<void>;

export const interactiveLoop: InteractiveLoop = async (agent) => {
  const question = await promptUser(`[user] `);

  const spinner = ora('Considering...').start();
  const response = await agent.chat(question);
  spinner.stop();

  console.log(`[bot] ${JSON.stringify(response)}`);

  return interactiveLoop(agent);
};

export default interactiveLoop;
