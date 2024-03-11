import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { CodeLlmError } from '@/index.js';
import { unitTestConfig, validTool } from '@tests/mocks';
import { expectError } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import { newImporter } from './newImporter.js';

const mocks = vi.hoisted(() => {
  return {
    initTools: vi.fn(),
  };
});

vi.mock('@/tool/index.js', () => ({
  initTools: mocks.initTools,
}));

describe('newImporter', () => {
  beforeAll(() => {
    initConfig(unitTestConfig);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an importer instance', async () => {
    mocks.initTools.mockResolvedValue(new Map([['validTool', validTool]]));
    const importSpy = vi.spyOn(validTool, 'import');
    const importer = await newImporter(unitTestConfig);

    expect(importer).toMatchObject({
      import: expect.any(Function),
    });

    const importRes = await importer.import();

    expect(importRes).toMatchObject({
      content: 'fake import complete',
      success: true,
    });
    expect(importSpy).toHaveBeenCalledTimes(1);
  });

  it('should return an error when no tools are available', async () => {
    mocks.initTools.mockResolvedValue(new Map());
    const importer = await newImporter(unitTestConfig);
    const importRes = await importer.import();
    expectError(importRes, 'importer:noTools');
  });

  it('should return an error when broken tool is imported', async () => {
    mocks.initTools.mockResolvedValue(new CodeLlmError({ code: 'tool:init' }));

    const importer = await newImporter(unitTestConfig);
    expectError(importer, 'tool:init');
  });

  it('should return an error when import fails', async () => {
    const badImport = () => new CodeLlmError({ code: 'tool:import' });
    mocks.initTools.mockResolvedValue(
      new Map([['validTool', { ...validTool, import: badImport }]]),
    );

    const importer = await newImporter(unitTestConfig);
    const importRes = await importer.import();

    expectError(importRes, 'tool:import');
  });
});
