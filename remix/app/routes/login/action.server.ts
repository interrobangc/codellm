import type { ActionFunctionArgs } from '@remix-run/node';

import { auth } from '@remix/.server/services/auth';

export const action = async ({ request }: ActionFunctionArgs) =>
  auth.authenticate('auth0', request);
