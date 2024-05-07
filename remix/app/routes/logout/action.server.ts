import type { ActionFunctionArgs } from '@remix-run/node';

import { logout } from '@remix/.server/services/auth';

export const action = async (params: ActionFunctionArgs) => {
  return logout(params);
};
