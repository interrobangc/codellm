import { unitTestConfig } from '@tests/mocks';

export const invalidFilePath = '/someFile';
export const validCacheFilePath = `${unitTestConfig.paths.cache}/someFile`;
export const validProjectFilePath = `${unitTestConfig.paths!.project}/someFile`;
