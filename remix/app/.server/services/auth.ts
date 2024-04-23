import type { Auth0Profile } from 'remix-auth-auth0';
import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';

import { getConfig } from '@remix/.server/config.js';

// This does not currently handle token refreshes. See https://github.com/danestves/remix-auth-auth0/issues/104

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
    //
    // Use the returned information to process or write to the DB.
    //
    return profile;
  },
);

auth.use(auth0Strategy);

export const { getSession, commitSession, destroySession } = sessionStorage;

export const isAuthenticated = () => auth.isAuthenticated;

export const getLogoutURL = (returnTo: string) => {
  const logoutURL = new URL(getConfig('auth0.logoutURL'));

  logoutURL.searchParams.set('client_id', getConfig('auth0.clientID'));
  logoutURL.searchParams.set('returnTo', returnTo);

  return logoutURL.toString();
};

export const getAuthUser = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'));
  return session.data.user;
};
