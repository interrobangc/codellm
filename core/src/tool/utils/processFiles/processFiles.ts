import { globby } from 'globby';
import { resolve } from 'path';

import type { ProcessFilesParams } from '@/.';

import { isError, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { processFile } from './processFile.js';

/**
 * Process all files matching a set of glob patterns in a directory using a given handle function
 *
 * @param {Object} params - The parameters for the processFiles function
 * @param {string} params.toolName - The name of the tool
 * @param {string} params.path - The path to the directory to process
 * @param {string[]} params.include - The glob patterns to include
 * @param {string[]} params.exclude - The glob patterns to exclude
 * @param {Function} params.handle - The handle function to use for processing the files
 * @returns {Promise<void>}
 */
export const processFiles = async ({
  exclude,
  handle,
  include,
  path,
  toolName,
}: ProcessFilesParams) => {
  const files = [
    ...include.map((i) => `${resolve(path)}/${i}`),
    ...exclude.map((e) => `!${resolve(path)}/${e}`),
  ];

  log('processFiles config', 'debug', {
    exclude,
    files,
    include,
    path,
    toolName,
  });

  const paths = await globby(files, {
    //TODO: gitignore seems to be broken upstream
    // gitignore: true,
    // ignoreFiles: [`${resolve(path)}.gitignore`],
  });

  log('processFiles paths', 'debug', { paths });

  const processFilesRes: Record<string, unknown> = {};

  const countTotal = paths.length;
  let countCurrent = 0;
  for (const filePath of paths) {
    const processFileRes = await promiseMayFail(
      processFile({
        countCurrent: countCurrent++,
        countTotal,
        filePath,
        handle,
        toolName,
      }),
      'processFiles:processFile',
      { filePath },
    );
    if (isError(processFileRes)) return processFileRes;

    processFilesRes[filePath] = processFileRes;
  }

  return processFilesRes;
};
