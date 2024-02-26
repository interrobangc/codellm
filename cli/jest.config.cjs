const { pathsToModuleNameMapper } = require('ts-jest');
const tsConfig = require('./tsconfig.json');

module.exports = (config) => {
  return (
    config || {
      preset: 'ts-jest',
      rootDir: '.',
      maxWorkers: 6,
      moduleNameMapper: pathsToModuleNameMapper(
        tsConfig.compilerOptions.paths,
        { useESM: true },
      ),
    }
  );
};
