export const AGENT_ERRORS = {
  'agent:addHistory': {
    message: 'Error adding to agent history',
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
