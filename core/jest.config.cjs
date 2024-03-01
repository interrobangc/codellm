const { pathsToModuleNameMapper } = require('ts-jest');
const tsConfig = require('./tsconfig.json');

const jestConfig = {
  preset: 'ts-jest',
  rootDir: '.',
  maxWorkers: 6,
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
      useESM: true,
      prefix: '<rootDir>/',
    }),
  },
};

module.exports = jestConfig;
