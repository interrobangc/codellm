import { vi } from 'vitest';
import { describe, expect, it } from 'vitest';

import { readFileSync } from 'fs';
import { dump as dumpYaml } from 'js-yaml';
import parseFile from './parseFile.js';

vi.mock('fs', () => ({
  readFileSync: vi.fn().mockImplementation(() => ''),
}));

const mockReadFileSync = vi.mocked(readFileSync);

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

    mockReadFileSync.mockImplementation(() => fileContent);
    const result = parseFile(filePath);
    expect(result).toEqual(data);
  });

  it('should throw an error when given an invalid file path', () => {
    const filePath = 'invalidFilePath.yaml';

    mockReadFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    expect(() => parseFile(filePath)).toThrow('File not found');
  });

  it('should throw an error when given a file with invalid YAML content', () => {
    const filePath = 'invalidYamlFile.yaml';

    const fileContent = 'invalid: yaml: content';

    mockReadFileSync.mockImplementation(() => fileContent);

    expect(() => parseFile(filePath)).toThrow('Invalid YAML content');
  });
});
