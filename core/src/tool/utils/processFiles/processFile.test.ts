import { beforeAll, describe, expect, it, vi } from 'vitest';

import { readFile } from 'fs/promises';
import {
  invalidFilePath,
  unitTestConfig,
  validProjectFilePath,
} from '@tests/mocks';
import { expectError } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import * as processFile from './processFile.js';

vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockImplementation(() => Promise.resolve('')),
}));

const readFileMock = vi.mocked(readFile);

describe('processFile', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  it('should process a valid file using handler', async () => {
    const fakeFileContent = 'fileContent';

    readFileMock.mockImplementation(() => Promise.resolve(fakeFileContent));
    let fileContentHolder: string;

    const res = await processFile.processFile({
      filePath: validProjectFilePath,
      handle: async ({ fileContent }) => {
        fileContentHolder = fileContent;
        return fileContent;
      },
      toolName: 'processFile',
    });
    expect(res).toEqual(fakeFileContent);

    // @ts-expect-error - used before defined
    expect(fileContentHolder).toEqual(fakeFileContent);
  });

  it('should return an invalid path error for an invalid file path', async () => {
    const fakeError = new Error('fakeError');
    readFileMock.mockImplementation(() => Promise.reject(fakeError));

    const res = await processFile.processFile({
      filePath: invalidFilePath,
      handle: async ({ fileContent }) => fileContent,
      toolName: 'processFile',
    });
    expectError(res, 'fs:invalidPath');
  });

  it('should return an error for an error in the handler', async () => {
    const fakeError = new Error('fakeError');
    readFileMock.mockImplementation(() => Promise.resolve(''));

    const res = await processFile.processFile({
      filePath: validProjectFilePath,
      handle: async () => Promise.reject(fakeError),
      toolName: 'processFile',
    });
    expectError(res, 'processFiles:handle');
  });
});
