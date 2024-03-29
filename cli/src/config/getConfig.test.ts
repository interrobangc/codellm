import { describe, expect, it, vi } from 'vitest';

import { readFileSync } from 'fs';
import { dump as dumpYaml } from 'js-yaml';
import merge from 'lodash/merge.js';

import { configFileData, expectedDefaultConfig } from '@cliTests/mocks/config';
import { PROVIDERS } from '@cli/config/constants';

import getConfig from './getConfig';

const configFile = './validConfig.yml';

vi.mock('fs', () => ({
  readFileSync: vi.fn().mockImplementation(() => ''),
}));

const mockReadFileSync = vi.mocked(readFileSync);

describe('getConfig', () => {
  it('should return the default config when no yargs are present', () => {
    mockReadFileSync.mockImplementation(() => dumpYaml(configFileData));
    const yargv = {};
    const result = getConfig(yargv);
    expect(result).toEqual(expectedDefaultConfig);
  });

  it('should return a valid partial configuration object when given valid input', () => {
    mockReadFileSync.mockImplementation(() => dumpYaml(configFileData));
    const yargv = {
      configFile,
      logLevel: 'debug',
    };

    const expectedConfig = merge({}, configFileData, yargv);
    expectedConfig.providers = PROVIDERS;

    const result = getConfig(yargv);
    expect(result).toEqual(expectedConfig);
  });

  it('should not return any invalid yarg options', () => {
    mockReadFileSync.mockImplementation(() => dumpYaml(configFileData));
    const yargv = {
      configFile,
      invalidOption: 'invalid',
    };

    const expectedConfig = {
      ...expectedDefaultConfig,
      configFile,
    };

    const result = getConfig(yargv);
    expect(result).toEqual(expectedConfig);
  });

  it('should throw an error when given an invalid file path', () => {
    const filePath = 'invalidFilePath.yaml';

    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => getConfig({ configFile: filePath })).toThrow('File not found');
  });
});
