import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import {
  destroySession,
  getLogoutURL,
  getSession,
} from '@remix/.server/services/auth';

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  throw redirect(getLogoutURL('/'), {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
};
