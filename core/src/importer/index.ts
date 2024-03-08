import type { Importer, PartialConfig } from '@/.';

import { log } from '@/log/index.js';
import { initTools } from '@/tool/index.js';
import { getConfig, initConfig } from '@/config/index.js';

/**
 * Create a new importer which is the primary interface to import code into the vector database
 *
 * @param configParam - The configuration to use
 *
 * @returns - The new importer instance for use by a client
 */
export const newImporter = async (
  configParam: PartialConfig,
): Promise<Importer> => {
  initConfig(configParam);
  const config = getConfig();

  const tools = await initTools(config);
  log('newImporter tools', 'silly', { tools });

  return {
    import: async () => {
      if (tools == null) return;
      const toolImports = Object.entries(tools).map(([toolName, tool]) => {
        if (tool.import == null) return;

        log(`Starting import for ${toolName}`);
        return tool.import();
      });

      await Promise.all(toolImports);
    },
  };
};

export * from './types.js';
