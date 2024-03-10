import { vi } from 'vitest';

export const testSetup = () => {
  vi.mock('@/log/index.js');
};

export default testSetup;
