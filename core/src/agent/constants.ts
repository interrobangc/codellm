export const AGENT_ERRORS = {
  'agent:decodeResponse': {
    message: 'Error decoding agent response',
  },
  'agent:maxDepthExceeded': {
    message: 'The agent model has reached the maximum depth of recursion.',
  },
  'agent:runTool': {
    message: 'Error running tool from agent',
  },
} as const;

export const AGENT_RECURSION_DEPTH_MAX = 5;
