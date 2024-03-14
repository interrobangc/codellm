import { vi } from 'vitest';

import { getEmitter } from '@/agent/emitter.js';
import * as log from '@/log/index.js';

const mockEmitter = {
  emit: vi.fn(),
  off: vi.fn(),
  on: vi.fn(),
};

vi.mock('@/agent/emitter.js', () => ({
  getEmitter: vi.fn().mockImplementation(() => mockEmitter),
}));

const mockAgentEmitter = vi.mocked(getEmitter);

// Get the mocked emit, off, and on functions
const mockEmit = mockAgentEmitter().emit;
const mockOff = mockAgentEmitter().off;
const mockOn = mockAgentEmitter().on;

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
    mockEmit,
    mockOff,
    mockOn,
  };
};

export default testSetup;
