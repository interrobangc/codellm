import {readFileSync} from 'fs';
import {load as loadYaml} from 'js-yaml';

export function parseFile(filePath: string) {
  const fileContent = readFileSync(filePath, 'utf8');
  const data = loadYaml(fileContent);
  return data;
}

export default parseFile;