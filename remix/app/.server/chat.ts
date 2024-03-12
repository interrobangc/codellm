import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { Agent } from '@codellm/core';
import {
  CodeLlmError,
  isAgentResponseResponse,
  isError,
  newAgent,
} from '@codellm/core';

let agent: Agent | CodeLlmError;

export const loader = async () => {
  agent = await newAgent({
    project: {
      name: 'CodeLlmWeb',
    },
    paths: {
      project: '..',
      cache: '../.cache',
    },
    // logLevel: 'debug',
  });

  if (isError(agent)) throw agent;
  const history = agent.getHistory();
  console.log(history);
  return json({ history });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const result = {
    error: null,
    llmResponse: null,
  };
  if (!agent || isError(agent)) return;
  console.log(agent);

  const formData = await request.clone().formData();
  console.log(formData.entries());
  console.log("formData.get('userMessage')", formData.get('userMessage'));
  const agentResponse = await agent.chat(formData.get('userMessage') as string);
  console.log(agentResponse);

  if (isError(agentResponse)) return { ...result, error: agentResponse };

  return {
    ...result,
    llmResponse: isAgentResponseResponse(agentResponse)
      ? agentResponse.content
      : null,
  };
};
