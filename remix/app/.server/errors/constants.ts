import { chatModel, userModel } from '@remix/.server/models';
import { authService, chatService, userService } from '@remix/.server/services';
import { CODE_LLM_ERRORS } from '@codellm/core';

export const ERROR_CODES = {
  ...CODE_LLM_ERRORS,
  ...chatModel.ERRORS,
  ...userModel.ERRORS,
  ...authService.ERRORS,
  ...chatService.ERRORS,
  ...userService.ERRORS,
} as const;
