#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { log, newAgent, newImporter } from '@codellm/core';

import { addCliOptions, getConfig } from '@cli/config/index.js';
import { interactiveLoop } from '@cli/interactiveLoop/index.js';

const main = async () => {
  const yargv = yargs(hideBin(process.argv))
    .command(
      ['$0', 'agent'],
      'Start the agent CLI',
      () => {},
      async (argv) => {
        const agent = await newAgent(getConfig(argv));
        await interactiveLoop(agent);
      },
    )
    .command(
      ['import'],
      'Import data',
      () => {},
      async (argv) => {
        const importer = await newImporter(getConfig(argv));
        await importer.import();

        log('Import complete');
      },
    );

  addCliOptions(yargv).parse();
};

main();
