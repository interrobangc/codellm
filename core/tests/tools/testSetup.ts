import { vi } from 'vitest';

import * as log from '@/log/index.js';

export type TestSetupParams = {
  disableLog?: boolean;
};

export const testSetup = ({ disableLog = true }: TestSetupParams = {}) => {
  const logSpy = vi.spyOn(log, 'log');
  if (disableLog) logSpy.mockImplementation(() => {});
  const consoleLogSpy = vi.spyOn(console, 'log');
  const consoleErrorSpy = vi.spyOn(console, 'error');

  return {
    consoleErrorSpy,
    consoleLogSpy,
    logSpy,
  };
};

export default testSetup;
