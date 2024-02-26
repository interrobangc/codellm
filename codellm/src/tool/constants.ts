import * as generalCodeQuery from './general/codeQuery/index.js';

export const TOOLS_TYPE = {
  'general.codeQuery': 'general.codeQuery',
} as const;

export const TOOLS = Object.values(TOOLS_TYPE);

export const TOOL_MODULES = {
  'general.codeQuery': generalCodeQuery,
} as const;
