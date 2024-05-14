import type { ToolModule } from '@/tool/types.js';

import isString from 'lodash/isString.js';
import { promiseMayFail } from '@/error/index.js';

/**
 * Import a tool module
 *
 * @param {string} moduleName The name of the module to import
 *
 * @returns {Promise<unknown | CodeLlmErrorType>}The tool module or an error
 */
export const importTool = async (module: ToolModule) => {
  if (isString(module)) {
    return promiseMayFail(import(module), 'tool:import', {
      moduleName: module,
    });
  }

  return module;
};
