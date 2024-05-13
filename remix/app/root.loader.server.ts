import type { LoaderFunctionArgs } from '@remix-run/node';
import { getAuth, rootAuthLoader } from '@clerk/remix/ssr.server';

import { getUser, validateUser } from '@remix/.server/services/user';
import { initClient } from '@remix/.server/db/db';
import { isError } from '@remix/.server/errors';

export const loader = async (args: LoaderFunctionArgs) =>
  rootAuthLoader(args, (cbArgs) => {
    console.log('cbArgs', cbArgs);
    return {};
  });

export type RootLoader = typeof loader;

export type RootLoaderData = Awaited<ReturnType<RootLoader>>;
