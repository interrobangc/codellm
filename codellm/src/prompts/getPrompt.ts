import {defaults} from './constants.js';

export function getPrompt(prompt: string):any {
  // @ts-ignore
  return defaults[prompt] || '';
}