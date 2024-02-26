import { DEFAULTS } from './constants.js';

export function getPrompt(prompt: string): string {
  // @ts-expect-error - quick and dirty for now
  return DEFAULTS[prompt] || '';
}
