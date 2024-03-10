import { vi } from 'vitest';

import * as log from '@/log/index.js';

const logSpy = vi.spyOn(log, 'log').mockImplementation(() => {});
const consoleLogSpy = vi.spyOn(console, 'log');
const consoleErrorSpy = vi.spyOn(console, 'error');

export const testSetup = () => {
  return {
    consoleErrorSpy,
    consoleLogSpy,
    logSpy,
  };
};

export default testSetup;
