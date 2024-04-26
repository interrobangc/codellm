import type { ServiceCommonParams } from './types';
import type { UserModel } from '@remix/.server/models';
import type { RemixError } from '@remix/.server/errors';

import { userModel } from '@remix/.server/models';
import { getAuthProfile } from '@remix/.server/services/auth';
import { isError, newError } from '@remix/.server/errors';

export const ERRORS = {
  'userService:noAuthUser': {
    message: 'No authenticated user found',
  },
  'userService:noUser': {
    message: 'No user found',
  },
  'userService:notVerified': {
    message: 'User is not verified',
  },
} as const;

export const getUser = async (params: ServiceCommonParams) => {
  const authUser = await getAuthProfile(params);

  if (!authUser) {
    return newError({
      code: 'userService:noAuthUser',
      message: 'No authenticated user found',
    });
  }

  return userModel.getByAuth0Id(authUser.id);
};

export const validateUser = (user: UserModel | RemixError) => {
  if (isError(user)) return user;
  if (!user) return newError({ code: 'userService:noUser' });
  if (!user.isVerified) return newError({ code: 'userService:notVerified' });

  return user;
};

export const getValidatedUser = async (params: ServiceCommonParams) => {
  const user = await getUser(params);

  return validateUser(user);
};
