import { newAgent } from '@interrobangc/codellm';

import { getConfig } from '@cli/config/index.js';
import { interactiveLoop } from '@cli/interactiveLoop/index.js';

const main = async () => {
  const config = getConfig();
  const agent = await newAgent(config);
  await interactiveLoop(agent);
};

main();
