import type { LoaderFunctionArgs } from '@remix-run/node';
import { getUser, validateUser } from '@remix/.server/services/user';
import { isError } from '@remix/.server/errors';
import { noAuthPayload } from '@remix/components/AuthProvider';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser({ request });
  if (isError(user)) return noAuthPayload;

  const validatedUser = validateUser(user);
  const isVerified = !isError(validatedUser);

  return {
    isAuthed: true,
    isVerified,
    user,
  };
};

export type RootLoader = typeof loader;

export type RootLoaderData = Awaited<ReturnType<RootLoader>>;
