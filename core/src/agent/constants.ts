export const AGENT_ERRORS = {
  'agent:decodeResponse': {
    message: 'Error decoding agent response',
  },
  'agent:maxDepthExceeded': {
    message: 'The agent model has reached the maximum depth of recursion.',
  },
} as const;

export const AGENT_RECURSION_DEPTH_MAX = 5;
