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
 * @param filePath - The file path to validate
 *
 * @returns - The resolved file path if it is valid
 *
 * @throws - If the file path is not valid
 *
 */
export const validatePath = (filePath: string) => {
  const config = getConfig();

  const resolvedFilePath = resolve(filePath);

  for (const path of Object.values(config.paths)) {
    if (resolvedFilePath.startsWith(resolve(path))) return resolvedFilePath;
  }

  return new CodeLlmError({
    code: 'fs:invalidPath',
    meta: { filePath },
  });
};

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

export const stat = async (filePath: string) => {
  const validatePathRes = validatePath(filePath);
  if (isError(validatePathRes)) return validatePathRes;

  return promiseMayFail(fsStat(validatePathRes), 'fs:statError', { filePath });
};

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

export * from './constants.js';
