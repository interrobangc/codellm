import { promiseMayFail } from '@/error/index.js';

/**
 * Import a tool module
 *
 * @param {string} moduleName The name of the module to import
 *
 * @returns {Promise<unknown | CodeLlmError>}The tool module or an error
 */
export const importTool = async (moduleName: string) =>
  promiseMayFail(import(moduleName), 'tool:import', { moduleName });
