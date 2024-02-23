import type { CodeLlmAgent } from '@interrobangc/codellm';

import {promptUser} from './promptUser'

type InteractiveLoop = (agent: CodeLlmAgent) => Promise<void>;

export const interactiveLoop: InteractiveLoop = async (agent) => {
  const question = await promptUser(`[user] `);

  const response = await agent.chat(question);

  console.log(`[bot] ${response}`);

  return interactiveLoop(agent);
}

export default interactiveLoop;
