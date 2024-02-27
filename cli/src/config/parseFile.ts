import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';

export function parseFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8');

  try {
    return loadYaml(fileContent);
  } catch (error) {
    throw new Error('Invalid YAML content');
  }
}

export default parseFile;
