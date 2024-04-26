import type { ActionFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';

import { getLogoutOptions, getLogoutURL } from '@remix/.server/services/auth';
import { isError } from '@remix/.server/errors';

export const action = async ({ request }: ActionFunctionArgs) => {
  const logoutUrl = getLogoutURL({ request, returnToPath: '/' });
  const logoutOptions = await getLogoutOptions({ request });
  if (isError(logoutOptions)) {
    return redirect('/');
  }

  throw redirect(logoutUrl, logoutOptions);
};
