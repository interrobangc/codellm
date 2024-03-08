export const AGENT_ERRORS = {
  'agent:decodeResponse': {
    message: 'Error decoding response',
  },
  'agent:maxDepthExceeded': {
    message: 'The agent model has reached the maximum depth of recursion.',
  },
} as const;
