import { CodeLlmLlms } from './types';

export const chat = (llms: CodeLlmLlms) => async (message: string): Promise<string> => {
  return llms['agent']?.chat('user', message) || 'No agent found';
}

export default chat;