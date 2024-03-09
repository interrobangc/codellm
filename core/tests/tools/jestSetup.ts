import { jest } from '@jest/globals';

export const jestSetup = () => {
  jest.mock('@/log/index.js');
};

export default jestSetup;
