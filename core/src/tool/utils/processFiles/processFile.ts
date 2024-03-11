import { createHash } from 'crypto';

import type { ProcessFileParams } from '@/.';

import { isError, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { readFile } from '@/fs/index.js';

/**
 * Process a single file using a given handle function
 *
 * @param {Object} params - The parameters for the processFile function
 * @param {string} params.toolName - The name of the tool
 * @param {string} params.filePath - The path to the file to process
 * @param {Function} params.handle - The handle function to use for processing the file
 * @returns
 */
export const processFile = async ({
  countCurrent,
  countTotal,
  filePath,
  handle,
  toolName,
}: ProcessFileParams) => {
  log(`${toolName} - Processing ${filePath}`, 'debug');

  const fileContent = await readFile(filePath);
  if (isError(fileContent)) return fileContent;

  const fileContentHash = createHash('sha256')
    .update(fileContent)
    .digest('hex');
  const filePathHash = createHash('sha256').update(filePath).digest('hex');

  return promiseMayFail(
    handle({
      countCurrent,
      countTotal,
      fileContent,
      fileContentHash,
      filePath,
      filePathHash,
    }),
    `processFiles:handle`,
    { filePath },
  );
};
