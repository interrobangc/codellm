import type { Importer, PartialConfig } from '@/.';

import { isError } from '@/error/index.js';
import { log } from '@/log/index.js';
import { initTools } from '@/tool/index.js';
import { initConfig } from '@/config/index.js';

/**
 * Create a new importer which is the primary interface to import code into the vector database
 *
 * @param configParam - The configuration to use
 *
 * @returns - The new importer instance for use by a client
 */
export const newImporter = async (configParam: PartialConfig) => {
  const initConfigRes = initConfig(configParam);
  if (isError(initConfigRes)) return initConfigRes;

  const tools = await initTools();
  if (isError(tools)) return tools;
  log('importer tools', 'silly', { tools });

  return {
    import: async () => {
      if (!tools.size) return;
      for (const [toolName, tool] of tools.entries()) {
        log(`Starting import for ${toolName}`);
        log('tool', 'silly', { tool });

        if (!tool.import) {
          log(`No import method found for ${toolName}`, 'warn');
          continue;
        }

        await tool.import();
      }
    },
  } as Importer;
};

export * from './types.js';
