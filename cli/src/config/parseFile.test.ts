import { jest } from '@jest/globals';
import { describe, expect, it } from '@jest/globals';

import fs from 'fs';
import { dump as dumpYaml } from 'js-yaml';
import parseFile from './parseFile.js';

describe('parseFile', () => {
  it('should successfully parse a valid YAML file when given a valid file path', () => {
    const filePath = 'validFilePath.yaml';

    const data = {
      array: [1, 2, 3],
      arrayOfObjects: [
        {
          some: 'object',
        },
      ],
      some: 'data',
    };

    const fileContent = dumpYaml(data);

    jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);
    const result = parseFile(filePath);
    expect(result).toEqual(data);
  });

  it('should throw an error when given an invalid file path', () => {
    const filePath = 'invalidFilePath.yaml';

    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => parseFile(filePath)).toThrow('File not found');
  });

  it('should throw an error when given a file with invalid YAML content', () => {
    const filePath = 'invalidYamlFile.yaml';

    const fileContent = 'invalid: yaml: content';

    jest.spyOn(fs, 'readFileSync').mockReturnValue(fileContent);

    expect(() => parseFile(filePath)).toThrow('Invalid YAML content');
  });
});
