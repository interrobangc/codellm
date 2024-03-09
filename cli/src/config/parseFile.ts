import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';

export function parseFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8');

  try {
    return loadYaml(fileContent);
  } catch (e) {
    throw new Error('Invalid YAML content in ${filePath}');
  }
}

export default parseFile;
