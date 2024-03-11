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
  import: async () => 'fake import complete',
  run: async () => 'some fake content',
};
