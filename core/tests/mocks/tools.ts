import { Tool } from '@/index.js';

export const validTool: Tool = {
  description: {
    description: 'fake description',
    name: 'fakeToolName',
    params: [
      {
        description: 'fake param description',
        name: 'fakeParamName',
        required: true,
        type: 'string',
      },
    ],
  },
  import: async () => {
    return {
      content: 'fake import complete',
      success: true,
    };
  },
  run: async () => {
    return {
      content: 'some fake content',
      success: true,
    };
  },
};
