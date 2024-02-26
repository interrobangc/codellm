import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import tsConfig from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  rootDir: '.',
  maxWorkers: 6,
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    useESM: true,
  }),
};

export default jestConfig;
