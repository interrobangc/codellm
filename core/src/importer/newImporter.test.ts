import { afterEach, describe, expect, it, vi } from 'vitest';

import { CodeLlmError, Config } from '@/index.js';
import { unitTestConfig, validTool } from '@tests/mocks';
import { expectError, testSetup } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import { newImporter } from './newImporter.js';

testSetup();

const mocks = vi.hoisted(() => {
  return {
    initTools: vi.fn(),
  };
});

vi.mock('@/tool/index.js', () => ({
  initTools: mocks.initTools,
}));

describe('newImporter', () => {
  const configs = [
    { ...unitTestConfig, shouldImportAsync: true },
    { ...unitTestConfig, shouldImportAsync: false },
  ];

  afterEach(() => {
    vi.clearAllMocks();
  });

  it.each(configs)(
    'should return an importer instance and import',
    async (config: Config) => {
      initConfig(config);
      mocks.initTools.mockResolvedValue(new Map([['validTool', validTool]]));
      const importSpy = vi.spyOn(validTool, 'import');
      const importer = await newImporter(unitTestConfig);

      expect(importer).toMatchObject({
        import: expect.any(Function),
      });

      const importRes = await importer.import();

      expect(importRes).toMatchObject(['fake import complete']);
      expect(importSpy).toHaveBeenCalledTimes(1);
    },
  );

  it.each(configs)(
    'should return an error when no tools are available',
    async (config: Config) => {
      initConfig(config);
      mocks.initTools.mockResolvedValue(new Map());
      const importer = await newImporter(unitTestConfig);
      const importRes = await importer.import();
      expectError(importRes, 'importer:noTools');
    },
  );

  it.each(configs)(
    'should return an error when broken tool is imported',
    async (config: Config) => {
      initConfig(config);
      mocks.initTools.mockResolvedValue(
        new CodeLlmError({ code: 'tool:init' }),
      );

      const importer = await newImporter(unitTestConfig);
      expectError(importer, 'tool:init');
    },
  );

  it.each(configs)(
    'should return an error when import fails',
    async (config: Config) => {
      initConfig(config);
      const badImport = () => new CodeLlmError({ code: 'tool:import' });
      mocks.initTools.mockResolvedValue(
        new Map([['validTool', { ...validTool, import: badImport }]]),
      );

      const importer = await newImporter(unitTestConfig);
      const importRes = await importer.import();

      expectError(importRes, 'importer:import');
    },
  );
});
