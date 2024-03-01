import { DEFAULTS } from './constants.js';

/**
 * Get the prompt for the given prompt name.
 *
 * @param prompt - The name of the prompt to get.
 * @returns The prompt.
 */
export function getPrompt(prompt: string): string {
  // @ts-expect-error - quick and dirty for now
  return DEFAULTS[prompt] || '';
}
