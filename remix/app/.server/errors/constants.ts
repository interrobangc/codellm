import { chatModel, userModel } from '@remix/.server/models';
import { authService, chatService, userService } from '@remix/.server/services';

export const ERROR_CODES = {
  ...chatModel.ERRORS,
  ...userModel.ERRORS,
  ...authService.ERRORS,
  ...chatService.ERRORS,
  ...userService.ERRORS,
} as const;
