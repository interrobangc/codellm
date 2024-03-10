/* eslint-disable import/no-extraneous-dependencies */

import { defineConfig } from 'vitest/config';
import path from 'path';
import tsConfig from './tsconfig.test.json';

const config = defineConfig({
  resolve: {
    alias: Object.entries(tsConfig.compilerOptions.paths).map(
      ([key, [value]]) => ({
        find: key.replace('/*', ''),
        replacement: path.resolve(__dirname, value.replace('/*', '')),
      }),
    ),
  },
  test: {
    globals: true,
  },
});

export default config;
