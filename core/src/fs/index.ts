import { resolve } from 'path';
import {
  mkdir as fsMkdir,
  readFile as fsReadFile,
  stat as fsStat,
  writeFile as fsWriteFile,
} from 'fs/promises';
import { getConfig } from '../config/index.js';

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

  throw new Error(`Path "${filePath}" is not allowed`);
};

export const mkdir = async (dirPath: string) =>
  fsMkdir(validatePath(dirPath), { recursive: true });

export const readFile = async (filePath: string) =>
  fsReadFile(validatePath(filePath), 'utf-8');

export const stat = async (filePath: string) => fsStat(validatePath(filePath));

export const writeFile = async (filePath: string, data: string) =>
  fsWriteFile(validatePath(filePath), data);
