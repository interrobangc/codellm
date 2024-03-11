import { CodeLlmError, isError } from '@/error/index.js';
import { getLlm } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { getTool } from '@/tool/index.js';
import * as agentTypes from './types.js';

/**
 * Handle the response from a tool
 *
 * @param {Object} params - The parameters for the handleToolResponse function
 * @param {Object} params.response - The response from the tool
 * @param {agentTypes.AgentToolResponses} params.toolResponses - The tool responses
 *
 * @returns - The tool responses or an error
 */
export const handleToolResponse = async ({
  response,
  toolResponses,
}: agentTypes.AgentHandleToolResponseParams): Promise<
  agentTypes.AgentToolResponses | CodeLlmError
> => {
  if (!agentTypes.isAgentToolResponse(response)) return toolResponses || {};
  const toolName = response.name;

  const tool = getTool(toolName);
  if (isError(tool)) {
    log('Tool not found', 'error', { toolName });
    return [...toolResponses, { name: toolName, response: 'Tool not found' }];
  }

  log(`Running the ${response.name} tool`);

  const toolLlm = getLlm('tool');
  if (isError(toolLlm)) return toolLlm;

  // TODO: move tool run response to a response or an CodeLlmError
  let toolResponse;
  try {
    toolResponse = await tool.run({
      llm: toolLlm,
      params: response.params,
    });
    log('Tool response', 'debug', { toolResponse });
  } catch (e) {
    log('Error running tool', 'error', { e, toolName });
    return [
      ...toolResponses,
      { name: toolName, response: 'Error running tool: ' + e },
    ];
  }

  log('Tool responses', 'debug', { toolResponses });

  return [...toolResponses, { name: toolName, response: toolResponse.content }];
};
