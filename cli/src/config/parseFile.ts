import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';

export function parseFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8');
  return loadYaml(fileContent);
}

export default parseFile;
