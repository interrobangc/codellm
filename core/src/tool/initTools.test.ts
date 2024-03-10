import { describe, expect, it, vi } from 'vitest';

import { unitTestConfig, validTool } from '@tests/mocks';
import { testSetup } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import { CodeLlmError, isError } from '@/error/index.js';
import { toolSchema } from './types.js';
import { importTool } from './importTool.js';
import * as initTools from './initTools.js';

testSetup();

vi.mock('./importTool.js', () => ({
  importTool: vi.fn().mockImplementation(() => ''),
}));

const mockImportTool = vi.mocked(importTool);

describe('initTools', () => {
  it('should initialize the tools', async () => {
    mockImportTool.mockImplementation(async () => ({
      newTool: () => validTool,
    }));
    initConfig(unitTestConfig);

    const tools = await initTools.initTools();
    expect(isError(tools)).toBeFalsy();

    // Dirty hack for type safety (expect above should fail before this)
    if (isError(tools)) return;

    expect(tools).toBeDefined();
    for (const [, tool] of tools.entries()) {
      expect(() => toolSchema.parse(tool)).not.toThrow();
    }
  });

  it('should return an error when a tool module cannot be imported', async () => {
    // vi.spyOn(initTools, 'importTool').mockResolvedValue(
    //   new CodeLlmError({ code: 'tool:import' }),
    // );
    mockImportTool.mockResolvedValue(new CodeLlmError({ code: 'tool:import' }));

    initConfig(unitTestConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
  });

  it('should return an error when a tool module does not export a newTool method', async () => {
    // vi.spyOn(initTools, 'importTool').mockResolvedValue({});
    mockImportTool.mockResolvedValue({});
    initConfig(unitTestConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
  });

  it('should return an error when a tool module returns an invalid tool', async () => {
    // vi.spyOn(initTools, 'importTool').mockResolvedValue({
    //   newTool: () => ({}),
    // });
    mockImportTool.mockResolvedValue({
      newTool: () => ({}),
    });

    initConfig(unitTestConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
    expect(
      // @ts-expect-error - no need to check type here
      isError(tools.meta?.['errors']?.[0]?.value, 'tool:invalidTool'),
    ).toBeTruthy();
  });
});
