import { log, newImporter } from '@interrobangc/codellm';

import { getConfig } from '@cli/config/index.js';

const main = async () => {
  const config = getConfig();
  const importer = await newImporter(config);
  await importer.import();

  log('Import complete');
};

main();
