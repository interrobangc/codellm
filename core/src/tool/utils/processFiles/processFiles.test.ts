import { beforeAll, describe, expect, it, vi } from 'vitest';

import { readFile } from 'fs/promises';
import { globby } from 'globby';
import { unitTestConfig, validProjectFilePath } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import * as processFiles from './processFiles.js';

vi.mock('fs/promises', () => ({
  readFile: vi.fn().mockImplementation(() => Promise.resolve('')),
}));
const readFileMock = vi.mocked(readFile);

vi.mock('globby', () => ({
  globby: vi.fn().mockImplementation(() => Promise.resolve('')),
}));
const globbyMock = vi.mocked(globby);

describe('processFile', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  it('should process a valid glob using handler', async () => {
    const fakeFileContent = 'fileContent';

    globbyMock.mockImplementation(() =>
      Promise.resolve([validProjectFilePath]),
    );
    readFileMock.mockImplementation(() => Promise.resolve(fakeFileContent));
    let fileContentHolder: string;

    const res = await processFiles.processFiles({
      exclude: [],
      handle: async ({ fileContent }) => {
        fileContentHolder = fileContent;
        return fileContent;
      },
      include: ['**/*.ts'],
      path: '/path',
      toolName: 'processFiles',
    });
    expect(res).toEqual({ [validProjectFilePath]: fakeFileContent });

    // @ts-expect-error - used before defined
    expect(fileContentHolder).toEqual(fakeFileContent);
  });

  it('should return CodeLlmError for  handler error', async () => {
    globbyMock.mockImplementation(() =>
      Promise.resolve([validProjectFilePath]),
    );
    readFileMock.mockImplementation(() => Promise.resolve('fileContent'));
    const res = await processFiles.processFiles({
      exclude: [],
      handle: async () => {
        throw new Error('handler error');
      },
      include: ['**/*.ts'],
      path: '/path',
      toolName: 'processFiles',
    });
    expectError(res, 'processFiles:processFile');
  });
});
