import { CodeLlmError, isError, promiseMayFail } from '@/error/index.js';
import { getLlm } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { getTool } from '@/tool/index.js';
import * as agentTypes from './types.js';
import { addToHistory } from './history.js';

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
  id,
  response,
  toolResponses,
}: agentTypes.AgentHandleToolResponseParams): Promise<
  agentTypes.AgentToolResponses | CodeLlmError
> => {
  if (!agentTypes.isAgentToolResponse(response)) return toolResponses || {};
  const toolName = response.name;
  const params = response.params;

  const tool = getTool(toolName);
  if (isError(tool)) {
    log('Tool not found', 'error', { toolName });
    return [...toolResponses, { name: toolName, response: 'Tool not found' }];
  }

  log(`Running the ${response.name} tool`);

  addToHistory(id, {
    name: toolName,
    params,
    role: 'tool',
  });

  const toolLlm = getLlm('tool');
  if (isError(toolLlm)) return toolLlm;

  // TODO: move tool run response to a response or an CodeLlmError
  const toolResponse = await promiseMayFail(
    tool.run({
      llm: toolLlm,
      params: response.params,
    }),
    `agent:runTool`,
    { response, tool, toolName },
  );
  log('handleToolResponse - Tool response', 'debug', { toolResponse });
  if (isError(toolResponse)) {
    log('Error running tool', 'error', { toolName, toolResponse });
    return [
      ...toolResponses,
      {
        name: toolName,
        response: 'Error running tool: ' + toolResponse.message,
      },
    ];
  }

  log('handleToolResponse - Tool responses', 'debug', { toolResponses });

  return [...toolResponses, { name: toolName, response: toolResponse }];
};
