import { newAgent } from '@interrobangc/codellm';

import { getConfig } from '../config/index.js';
import { interactiveLoop } from '../interactiveLoop/index.js';

const main = async () => {
  const config = getConfig();
  const agent = await newAgent(config);
  await interactiveLoop(agent);
};

main();
