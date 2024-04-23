import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { getUser } from '@remix/.server/services/user';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser({ request });

  return json({
    user,
  });
};

export type RootLoaderData = Awaited<ReturnType<typeof loader>>;
