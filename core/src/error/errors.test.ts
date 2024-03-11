import { beforeEach, describe, expect, it } from 'vitest';

import * as error from './index.js';
import { setConfig } from '../config/config.js';

const errorCode = 'error:unknown';

describe('isError', () => {
  it('should return true for an error', () => {
    expect(error.isError(new error.CodeLlmError({ code: errorCode }))).toBe(
      true,
    );
  });

  it('should return false for a non-error', () => {
    expect(error.isError('not an error')).toBe(false);
  });
});

describe('mayFail', () => {
  it('should return the result of the target', () => {
    const target = () => 1;
    expect(error.mayFail(target, errorCode)).toBe(1);
  });

  it('should return an error if the target fails', () => {
    const target = () => {
      throw new Error('fail');
    };
    const res = error.mayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });

  it('should return an error if the target returns an error', () => {
    const target = () => new error.CodeLlmError({ code: errorCode });
    const res = error.mayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });
});

describe('promiseMayFail', () => {
  it('should return the result of the promise', async () => {
    const target = Promise.resolve(1);
    expect(await error.promiseMayFail(target, errorCode)).toBe(1);
  });

  it('should return an error if the promise fails', async () => {
    const target = Promise.reject(new Error('fail'));
    const res = await error.promiseMayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });

  it('should return an error if the promise returns an error', async () => {
    const target = Promise.resolve(new error.CodeLlmError({ code: errorCode }));
    const res = await error.promiseMayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });
});

describe('promiseMapMayFail', () => {
  it('should return the result of the promises', async () => {
    const target = [Promise.resolve(1), Promise.resolve(2)];
    expect(await error.promiseMapMayFail(target, errorCode)).toEqual([1, 2]);
  });

  it('should return an error if any of the promises fail', async () => {
    const target = [Promise.resolve(1), Promise.reject(new Error('fail'))];
    const res = await error.promiseMapMayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });

  it('should return an error if any of the promises return an error', async () => {
    const target = [
      Promise.resolve(1),
      Promise.resolve(new error.CodeLlmError({ code: errorCode })),
    ];
    const res = await error.promiseMapMayFail(target, errorCode);
    expect(error.isError(res)).toBe(true);
  });
});

describe('throwOrReturn', () => {
  beforeEach(() => {
    setConfig({ shouldThrow: false });
  });

  it('should return the result of the target when not an error', () => {
    expect(error.throwOrReturn(1)).toBe(1);
  });

  it('should return the error when the target is an error and shouldThrow false', () => {
    expect(
      error.throwOrReturn(new error.CodeLlmError({ code: errorCode })),
    ).toEqual(new error.CodeLlmError({ code: errorCode }));
  });

  it('should throw an error if the target is an error and shouldThrow true', () => {
    setConfig({ shouldThrow: true });
    expect(() =>
      error.throwOrReturn(new error.CodeLlmError({ code: errorCode })),
    ).toThrow();
  });
});
