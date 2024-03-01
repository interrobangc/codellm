import { globby } from 'globby';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

import type { ProcessFileParams, ProcessFilesParams } from '@/.';

import log from '@/log/index.js';

/**
 * Process a single file using a given handle function
 *
 * @param {Object} params - The parameters for the processFile function
 * @param {string} params.toolName - The name of the tool
 * @param {string} params.filePath - The path to the file to process
 * @param {Function} params.handle - The handle function to use for processing the file
 * @returns {Promise<void>}
 */
export const processFile = async ({
  toolName,
  filePath,
  handle,
}: ProcessFileParams): Promise<void> => {
  log(`${toolName} - Processing ${filePath}`);

  const fileContent = await readFile(filePath, 'utf-8');
  const fileContentHash = createHash('sha256')
    .update(fileContent)
    .digest('hex');
  const filePathHash = createHash('sha256').update(filePath).digest('hex');

  await handle({
    fileContent,
    fileContentHash,
    filePath,
    filePathHash,
  });
};

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
  toolName,
  path,
  include,
  exclude,
  handle,
}: ProcessFilesParams): Promise<void> => {
  const files = [
    ...include.map((i) => `${resolve(path)}/${i}`),
    ...exclude.map((e) => `!${resolve(path)}/${e}`),
  ];

  const paths = await globby(files, {
    //TODO: gitignore seems to be broken upstream
    // gitignore: true,
    // ignoreFiles: [`${resolve(path)}.gitignore`],
  });

  log('importPaths', 'debug', { paths });

  for (const filePath of paths) {
    await processFile({
      toolName,
      filePath,
      handle,
    });
  }
};
