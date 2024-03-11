import type { Config, Importer, PartialConfig, Tool, Tools } from '@/.';

import {
  CodeLlmError,
  isError,
  promiseMapMayFail,
  promiseMayFail,
} from '@/error/index.js';
import { log } from '@/log/index.js';
import { initTools } from '@/tool/index.js';
import { initConfig } from '@/config/index.js';

export const runToolImport = async (toolName: string, tool: Tool) => {
  log(`Starting import for ${toolName}`);
  log('tool', 'silly', { tool });

  if (!tool.import) {
    log(`No import method found for ${toolName}`, 'warn');
    return 'No import method found';
  }

  return promiseMayFail(tool.import(), `tool:import`, {
    toolName,
  });
};

export const syncImport = async (tools: Tools) => {
  const results = [];
  for (const [toolName, tool] of tools.entries()) {
    const runToolImportRes = await promiseMayFail(
      runToolImport(toolName, tool),
      `importer:import`,
      {
        toolName,
      },
    );
    if (isError(runToolImportRes)) return;

    results.push(runToolImportRes);
  }

  return results;
};

export const asyncImport = async (tools: Tools) => {
  const importMap = Array.from(tools.entries()).map(async ([toolName, tool]) =>
    runToolImport(toolName, tool),
  );
  return promiseMapMayFail(importMap, `importer:import`);
};

export const runImport = (config: Config, tools: Tools) => {
  if (!tools.size) return new CodeLlmError({ code: 'importer:noTools' });
  if (config.shouldImportAsync) {
    log('asynchronous import started');
    return asyncImport(tools);
  }

  log('synchronous import started');
  return syncImport(tools);
};

/**
 * Create a new importer which is the primary interface to import code into the vector database
 *
 * @param configParam - The configuration to use
 *
 * @returns - The new importer instance for use by a client
 */
export const newImporter = async (configParam: PartialConfig) => {
  const config = initConfig(configParam);
  if (isError(config)) return config;

  const tools = await initTools();
  if (isError(tools)) return tools;
  log('importer tools', 'silly', { tools });

  return {
    import: async () => runImport(config, tools),
  } as Importer;
};
