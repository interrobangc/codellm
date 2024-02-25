import { newImporter, log } from '@interrobangc/codellm';

import { getConfig } from '../config/index.js';

const main = async () => {
  const config = getConfig();
  const importer = await newImporter(config);
  await importer.import();

  log('Import complete');
};

main();
