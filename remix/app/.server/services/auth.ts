import type { Auth0Profile } from 'remix-auth-auth0';
import { createCookieSessionStorage } from '@remix-run/node';
import { Authenticator } from 'remix-auth';
import { Auth0Strategy } from 'remix-auth-auth0';

import { getConfig } from '@remix/.server/config.js';
import { userModel } from '@remix/.server/models';

// This does not currently handle token refreshes. See https://github.com/danestves/remix-auth-auth0/issues/104

export const ERRORS = {} as const;

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

    if (user) return profile;

    await userModel.create({
      auth0Id: profile.id,
      email: profile.emails?.[0].value || '',
      firstName: profile.displayName?.split(' ')[0],
      lastName: profile.displayName?.split(' ')[-1],
    });

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
