import { jest } from '@jest/globals';
import { describe, expect, it } from '@jest/globals';

import fs from 'fs';
import { dump as dumpYaml } from 'js-yaml';
import merge from 'lodash/merge.js';

import { configFileData, expectedDefaultConfig } from '@cliTests/mocks/config';

import { getConfig } from './index';

describe('getConfig', () => {
  it('should return the default config when no yargs are present', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(dumpYaml(configFileData));

    const yargv = {};
    const result = getConfig(yargv);
    expect(result).toEqual(expectedDefaultConfig);
  });

  it('should return a valid partial configuration object when given valid input', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(dumpYaml(configFileData));

    const yargv = {
      configFile: './validConfig.yml',
      logLevel: 'debug',
    };

    const expectedConfig = merge({}, configFileData, yargv);
    const result = getConfig(yargv);
    expect(result).toEqual(expectedConfig);
  });

  it('should not return any invalid yarg options', () => {
    jest.spyOn(fs, 'readFileSync').mockReturnValue(dumpYaml(configFileData));

    const yargv = {
      configFile: './validConfig.yml',
      invalidOption: 'invalid',
    };

    const expectedConfig = {
      ...expectedDefaultConfig,
      configFile: './validConfig.yml',
    };

    const result = getConfig(yargv);
    expect(result).toEqual(expectedConfig);
  });

  it('should throw an error when given an invalid file path', () => {
    const filePath = 'invalidFilePath.yaml';

    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => getConfig({ configFile: filePath })).toThrow('File not found');
  });
});
