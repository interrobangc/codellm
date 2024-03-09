import { globby } from 'globby';
import { resolve } from 'path';
import { createHash } from 'crypto';

import type { ProcessFileParams, ProcessFilesParams } from '@/.';

import { isError } from '@/error/index.js';
import log from '@/log/index.js';
import { readFile } from '@/fs/index.js';

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
}: ProcessFileParams) => {
  log(`${toolName} - Processing ${filePath}`, 'debug');

  const fileContent = await readFile(filePath);
  if (isError(fileContent)) return fileContent;

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

  return false;
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

  for (const filePath of paths) {
    await processFile({
      filePath,
      handle,
      toolName,
    });
  }
};
