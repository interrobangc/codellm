import { resolve } from 'path';
import {
  mkdir as fsMkdir,
  readFile as fsReadFile,
  stat as fsStat,
  writeFile as fsWriteFile,
} from 'fs/promises';
import { getConfig } from '../config/index.js';
import { CodeLlmError, isError, promiseMayFail } from '@/error/index.js';

/**
 * We want to make sure that the file path is within the project paths before we do anything with it.
 * This is to prevent any accidental file operations outside of the project. This isn't perfect, but it's a start.
 */

/**
 * Validate that a file path is within the project paths
 *
 * @param {string} filePath - The file path to validate
 *
 * @returns {string | CodeLlmError} The resolved file path if it is valid or a CodeLlmError with the error in the meta
 */
export const validatePath = (filePath: string) => {
  const config = getConfig();
  if (isError(config)) return config;

  const resolvedFilePath = resolve(filePath);

  for (const path of Object.values(config.paths)) {
    if (resolvedFilePath.startsWith(resolve(path))) return resolvedFilePath;
  }

  return new CodeLlmError({
    code: 'fs:invalidPath',
    meta: { filePath },
  });
};

/**
 * Make a directory
 *
 * @param {string} dirPath - The directory path to make
 *
 * @returns {Promise<CodeLlmError | void>} A promise that resolves with void or rejects with a CodeLlmError
 *
 */
export const mkdir = async (dirPath: string) => {
  const validatePathRes = validatePath(dirPath);
  if (isError(validatePathRes)) return validatePathRes;

  return promiseMayFail(
    fsMkdir(validatePathRes, { recursive: true }),
    'fs:mkdirError',
    {
      dirPath,
    },
  );
};

/**
 * Read a file
 *
 * @param {string} filePath - The file path to read
 *
 * @returns {Promise<CodeLlmError | string>} A promise that resolves with the file content or rejects with a CodeLlmError
 */
export const readFile = async (filePath: string) => {
  const validatePathRes = validatePath(filePath);
  if (isError(validatePathRes)) return validatePathRes;

  return promiseMayFail(
    fsReadFile(validatePathRes, 'utf8'),
    'fs:readFileError',
    {
      filePath,
    },
  );
};

/**
 * Write a file
 *
 * @param {string} filePath - The file path to write to
 * @param {string} data - The data to write to the file
 *
 * @returns {Promise<CodeLlmError | void>} A promise that resolves with void or rejects with a CodeLlmError
 */
export const writeFile = async (filePath: string, data: string) => {
  const validatePathRes = validatePath(filePath);
  if (isError(validatePathRes)) return validatePathRes;

  return promiseMayFail(
    fsWriteFile(validatePathRes, data),
    'fs:writeFileError',
    {
      filePath,
    },
  );
};

/**
 * Get the stats of a file
 *
 * @param {string} filePath - The file path to get the stats of
 *
 * @returns {Promise<CodeLlmError | fs.Stats>} A promise that resolves with the stats of the file or rejects with a CodeLlmError
 */
export const stat = async (filePath: string) => {
  const validatePathRes = validatePath(filePath);
  if (isError(validatePathRes)) return validatePathRes;

  return promiseMayFail(fsStat(validatePathRes), 'fs:statError', { filePath });
};
