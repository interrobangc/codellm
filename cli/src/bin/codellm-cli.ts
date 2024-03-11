#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { isError, log, newAgent, newImporter } from '@codellm/core';

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
        if (isError(agent)) {
          log('Error creating agent', 'error', { agent });
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw agent;
        }
        await interactiveLoop(agent);
      },
    )
    .command(
      ['import'],
      'Import data',
      () => {},
      async (argv) => {
        const importer = await newImporter(getConfig(argv));
        if (isError(importer)) {
          log('Error creating importer', 'error', { importer });
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw importer;
        }

        const importRes = await importer.import();
        if (isError(importRes)) {
          log('Error importing', 'error', { importRes });
          // eslint-disable-next-line @typescript-eslint/no-throw-literal
          throw importRes;
        }

        log('Import complete');
      },
    );

  addCliOptions(yargv).parse();
};

main();
