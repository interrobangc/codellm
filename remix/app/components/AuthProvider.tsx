import type { User } from '@prisma/client';
import type { RootLoaderData } from '@remix/root.loader.server';

import { useLoaderData } from '@remix-run/react';
import { createContext } from 'react';

export type AuthContextType = {
  user: User | null;
};

export const AuthContext = createContext({ user: null });

export type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const data = useLoaderData<RootLoaderData>();
  // @ts-expect-error - we know this is a User or null
  const value = data?.user ? { user: data.user } : { user: null };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
