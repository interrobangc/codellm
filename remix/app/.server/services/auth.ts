import type { Auth0Profile } from 'remix-auth-auth0';
import type { ServiceCommonParams } from './types';

import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';

import { getConfig } from '@remix/.server/config';
import { isError, newError } from '@remix/.server/errors';
import { userModel } from '@remix/.server/models';

// This does not currently handle token refreshes. See https://github.com/danestves/remix-auth-auth0/issues/104

export const ERRORS = {
  'auth:noSession': {
    message: 'No session found',
  },
} as const;

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '_remix_session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [getConfig('auth0.secrets')],
    secure: process.env.NODE_ENV === 'production',
  },
});

export const auth = new Authenticator<Auth0Profile>(sessionStorage);

const auth0Strategy = new Auth0Strategy(
  getConfig('auth0'),
  async ({ profile }) => {
    if (!profile.id) {
      return profile;
    }

    const user = await userModel.getByAuth0Id(profile.id);
    if (!isError(user)) return profile;
    if (!isError(user, 'userModel:notFound')) throw user;

    const createRes = await userModel.create({
      auth0Id: profile.id,
      email: profile.emails?.[0].value || '',
      firstName: profile.displayName?.split(' ')[0],
      lastName: profile.displayName?.split(' ')[-1],
      isVerified: getConfig('user.userAutoVerify'),
    });
    if (isError(createRes)) throw createRes;

    return profile;
  },
);

auth.use(auth0Strategy);

export const { commitSession, destroySession } = sessionStorage;

export const isAuthenticated = () => auth.isAuthenticated;

export const getSession = async ({ request }: ServiceCommonParams) => {
  if (!request?.headers.has('Cookie')) return null;
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie'),
  );
  return session;
};

export type LogoutParams = ServiceCommonParams & {
  returnToPath?: string;
};

export const getLogoutURL = ({ request, returnToPath = '/' }: LogoutParams) => {
  // Parse the request URL to get the origin and replace the path
  const url = new URL(request.url);
  const returnToURL = new URL(returnToPath, url.origin);

  const logoutURL = new URL(getConfig('auth0.logoutURL'));
  logoutURL.searchParams.set('client_id', getConfig('auth0.clientID'));
  logoutURL.searchParams.set('returnTo', returnToURL.toString());

  return logoutURL.toString();
};

export const getLogoutOptions = async (params: ServiceCommonParams) => {
  const session = await getSession(params);
  if (!session) return newError({ code: 'auth:noSession' });

  return {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  };
};

export const logout = async (params: LogoutParams) => {
  const logoutUrl = getLogoutURL(params);
  const logoutOptions = await getLogoutOptions(params);
  if (isError(logoutOptions)) throw redirect('/');

  throw redirect(logoutUrl, logoutOptions);
};

export const getAuthProfile = async ({ request }: ServiceCommonParams) => {
  if (getConfig('user.userAutoLogin')) return { id: 'mock-user' };
  const session = await getSession({ request });

  if (!session) return null;
  return session.data.user;
};
