import type { Tool, Tools } from '@/.';

import { CodeLlmError } from '@/error/index.js';

export const tools: Tools = new Map();

/**
 * Get a tool instance from the tool library
 *
 * @param {string} name The name of the tool
 *
 * @returns {Tool | CodeLlmErrorType} The tool instance or an error
 */
export const getTool = (name: string) => {
  const tool = tools.get(name);
  if (!tool) {
    return new CodeLlmError({ code: 'tool:notFound' });
  }
  return tool;
};

/**
 * Add Tool to the tool library
 *
 * @param {string} name The name of the tool
 * @param {Tool} tool The tool instance
 *
 * @returns {void}
 */
export const setTool = (name: string, tool: Tool) => tools.set(name, tool);

/**
 * Get the tool library
 *
 * @returns {Tools} The tool library
 */
export const getTools = () => tools;
