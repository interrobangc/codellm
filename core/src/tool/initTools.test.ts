import { describe, expect, it, jest } from '@jest/globals';

import { testConfig, validTool } from '@tests/mocks';
import { jestSetup } from '@tests/tools';
import { initConfig } from '@/config/index.js';
import { CodeLlmError, isError } from '@/error/index.js';
import { toolSchema } from './types.js';
import * as initTools from './initTools';

jestSetup();

describe('initTools', () => {
  it('should initialize the tools', async () => {
    jest
      .spyOn(initTools, 'importTool')
      .mockResolvedValue({ newTool: () => validTool });
    initConfig(testConfig);

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
    jest
      .spyOn(initTools, 'importTool')
      .mockResolvedValue(new CodeLlmError({ code: 'tool:import' }));

    initConfig(testConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
  });

  it('should return an error when a tool module does not export a newTool method', async () => {
    jest.spyOn(initTools, 'importTool').mockResolvedValue({});
    initConfig(testConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
  });

  it('should return an error when a tool module returns an invalid tool', async () => {
    jest
      .spyOn(initTools, 'importTool')
      .mockResolvedValue({ newTool: () => ({}) });

    initConfig(testConfig);

    const tools = await initTools.initTools();
    expect(isError(tools, 'tool:init')).toBeTruthy();
    expect(
      // @ts-expect-error - no need to check type here
      isError(tools.meta?.['errors']?.[0]?.value, 'tool:invalidTool'),
    ).toBeTruthy();
  });
});
