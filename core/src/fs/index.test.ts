import { beforeEach, describe, expect, it } from '@jest/globals';
import { resolve } from 'path';

import { testConfig } from '@tests/mocks';
import { validatePath } from './index.js';
import { initConfig } from '../config/index.js';

describe('validatePath', () => {
  beforeEach(() => {
    initConfig(testConfig);
  });

  it('should allow relative paths within the project', () => {
    const filePath = `${testConfig.paths!.project}/someFile`;
    expect(validatePath(filePath)).toEqual(resolve(filePath));
  });

  it('should allow relative paths within the cache directory', () => {
    const filePath = `${testConfig.paths!.cache}/someFile`;
    expect(validatePath(filePath)).toEqual(resolve(filePath));
  });

  it('should allow absolute paths within the project', () => {
    const filePath = resolve(`${testConfig.paths!.cache}/someFile`);
    expect(validatePath(filePath)).toEqual(filePath);
  });

  it('should throw an error for paths outside the project', () => {
    const filePath = '/someFile';
    expect(() => validatePath(filePath)).toThrowError(
      `Path "${filePath}" is not allowed`,
    );
  });

  it('should throw an error for paths outside the project or cache using paths with internal relative shorthand', () => {
    const filePath = `${resolve(testConfig.paths!.project)}../../someFile`;
    expect(() => validatePath(filePath)).toThrowError(
      `Path "${filePath}" is not allowed`,
    );
  });
});
