import type { LoaderFunction } from '@remix-run/node';

import { auth } from '@remix/.server/services/auth';

export const loader: LoaderFunction = async ({ request }) => {
  return auth.authenticate('auth0', request, {
    failureRedirect: '/',
    successRedirect: '/chat',
  });
};
