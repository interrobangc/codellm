import {getAgent} from '@interrobangc/codellm'

import {getConfig} from '../config'
import {interactiveLoop} from '../interactiveLoop/interactiveLoop';

const main = async () => {
  const config = getConfig();

  const agent = await getAgent(config);

  await interactiveLoop(agent);
}

main();
