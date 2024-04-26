import type { ServiceCommonParams } from './types';
import type { UserModel } from '@remix/.server/models';
import type { RemixError } from '@remix/.server/errors';

import { redirect } from '@remix-run/node';
import { userModel } from '@remix/.server/models';
import { getAuthProfile, logout } from '@remix/.server/services/auth';
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

  const user = await userModel.getByAuth0Id(authUser.id);
  if (isError(user, 'userModel:notFound')) return logout(params);
  if (isError(user)) throw user;

  return user;
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
