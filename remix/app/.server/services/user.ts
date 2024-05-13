import type { ServiceCommonArgs } from './types';
import type { UserModel } from '@remix/.server/models';
import type { RemixError } from '@remix/.server/errors';

import { getAuth } from '@clerk/remix/ssr.server';
import { userModel } from '@remix/.server/models';
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

export const getUser = async (args: ServiceCommonArgs) => {
  const authUser = await getAuth(args);
  console.log('authUser', authUser);
  if (!authUser.userId) {
    return newError({
      code: 'userService:noAuthUser',
      message: 'No authenticated user found',
    });
  }

  // @ts-expect-error - not fighting with types for now
  const user = await userModel.getByAuth0Id(authUser.id);
  // if (isError(user, 'userModel:notFound')) return logout(args);
  if (isError(user)) throw user;

  return user;
};

export const validateUser = (user: UserModel | RemixError) => {
  if (isError(user)) return user;
  if (!user) return newError({ code: 'userService:noUser' });
  if (!user.isVerified) return newError({ code: 'userService:notVerified' });

  return user;
};

export const getValidatedUser = async (args: ServiceCommonArgs) => {
  const user = await getUser(args);

  return validateUser(user);
};
