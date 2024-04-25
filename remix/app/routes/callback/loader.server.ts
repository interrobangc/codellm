import type { LoaderFunctionArgs } from '@remix-run/node';

import { auth } from '@remix/.server/services/auth';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return auth.authenticate('auth0', request, {
    failureRedirect: '/',
    successRedirect: '/chat',
  });
};
