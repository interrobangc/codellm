export const AGENT_ERRORS = {
  'agent:addHistory': {
    message: 'Error adding to agent history',
  },
  'agent:chat:sendUserMessage': {
    message: 'Error sending user message to llm client',
  },
  'agent:decodeResponse': {
    message: 'Error decoding agent response',
  },
  'agent:emitter:getEmmitter': {
    message: 'Error getting emitter',
  },
  'agent:maxDepthExceeded': {
    message: 'The agent model has reached the maximum depth of recursion.',
  },
  'agent:runTool': {
    message: 'Error running tool from agent',
  },
} as const;

export const AGENT_RECURSION_DEPTH_MAX = 5;

export const AGENT_EMITTER_CHANNELS = {
  assistant: 'agent:assistant',
  error: 'agent:error',
  tool: 'agent:tool',
  toolResponse: 'agent:toolResponse',
  user: 'agent:user',
} as const;
