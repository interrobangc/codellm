import {defaults} from './constants.js';

export function getPrompt(prompt: string): string {
  // @ts-expect-error - quick and dirty for now
  return defaults[prompt] || '';
}