import type { ServiceCommonParams } from './types';

import { userModel } from '@remix/.server/models';
import { getAuthUser } from '@remix/.server/services/auth';

export const getUser = async ({ request }: ServiceCommonParams) => {
  const authUser = await getAuthUser(request);

  if (!authUser) {
    return null;
  }
  return userModel.getByAuth0Id(authUser.id);
};
