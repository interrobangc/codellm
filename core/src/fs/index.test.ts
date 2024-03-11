import { beforeAll, describe, expect, it, vi } from 'vitest';
import { resolve } from 'path';

import { unitTestConfig } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import * as fsPromises from 'fs/promises';
import * as fs from './index.js';

const invalidFilePath = '/someFile';
const validCacheFilePath = `${unitTestConfig.paths.cache}/someFile`;
const validProjectFilePath = `${unitTestConfig.paths!.project}/someFile`;

const invalidPathErrorCode = 'fs:invalidPath';

vi.mock('fs/promises', () => ({
  mkdir: vi.fn().mockImplementation(() => Promise.resolve()),
  readFile: vi.fn().mockImplementation(() => Promise.resolve('')),
  stat: vi.fn().mockImplementation(() => Promise.resolve()),
  writeFile: vi.fn().mockImplementation(() => Promise.resolve()),
}));

describe('validatePath', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  it('should allow relative paths within the project', () => {
    expect(fs.validatePath(validProjectFilePath)).toEqual(
      resolve(validProjectFilePath),
    );
  });

  it('should allow relative paths within the cache directory', () => {
    expect(fs.validatePath(validCacheFilePath)).toEqual(
      resolve(validCacheFilePath),
    );
  });

  it('should allow absolute paths within the project', () => {
    expect(fs.validatePath(resolve(validCacheFilePath))).toEqual(
      resolve(validCacheFilePath),
    );
  });

  it('should return an error for paths outside the project', () => {
    expectError(fs.validatePath(invalidFilePath), invalidPathErrorCode);
  });

  it('should return an error for paths outside the project or cache using paths with internal relative shorthand', () => {
    const filePath = `${resolve(unitTestConfig.paths!.project)}../../someFile`;
    expectError(fs.validatePath(filePath), invalidPathErrorCode);
  });
});

describe('functions', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  const functions: {
    additionalArgs?: string[];
    errorCode: string;
    functionName: string;
    mock: ReturnType<typeof vi.mocked<T>>;
    spyCalledWith?: unknown[];
  }[] = [
    {
      errorCode: 'fs:mkdirError',
      functionName: 'mkdir',
      mock: vi.mocked(fsPromises.mkdir),
      spyCalledWith: [{ recursive: true }],
    },
    {
      errorCode: 'fs:readFileError',
      functionName: 'readFile',
      mock: vi.mocked(fsPromises.readFile),
      spyCalledWith: ['utf8'],
    },
    {
      additionalArgs: ['some data'],
      errorCode: 'fs:writeFileError',
      functionName: 'writeFile',
      mock: vi.mocked(fsPromises.writeFile),
      spyCalledWith: ['some data'],
    },
    {
      errorCode: 'fs:statError',
      functionName: 'stat',
      mock: vi.mocked(fsPromises.stat),
    },
  ] as const;

  it.each(functions)(
    'should handle valid path for %s',
    async ({ additionalArgs, functionName, mock, spyCalledWith }) => {
      mock.mockImplementation(async () => Promise.resolve(undefined));

      const res = await fs[functionName](
        validProjectFilePath,
        ...(additionalArgs || []),
      );

      expect(res).toBeUndefined();
      expect(mock).toHaveBeenCalledWith(
        resolve(validProjectFilePath),
        ...(spyCalledWith || []),
      );
    },
  );

  it.each(functions)(
    'should fail on invalid path for %s',
    async ({ additionalArgs, functionName }) => {
      const res = await fs[functionName](
        invalidFilePath,
        ...(additionalArgs || []),
      );
      expectError(res, invalidPathErrorCode);
    },
  );

  it.each(functions)(
    'should handle errors in call to fs promise function for %s',
    async ({ additionalArgs, errorCode, functionName, mock }) => {
      mock.mockImplementation(async () =>
        Promise.reject(new Error('some error')),
      );
      const res = await fs[functionName](
        validProjectFilePath,
        ...(additionalArgs || []),
      );
      expectError(res, errorCode);
    },
  );
});
