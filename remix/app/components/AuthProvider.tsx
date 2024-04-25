import type { RootLoader, RootLoaderData } from '@remix/root.loader.server';

import { useLoaderData } from '@remix-run/react';
import { createContext } from 'react';

export const noAuthPayload = {
  isAuthed: false,
  isVerified: false,
  user: null,
};

export const AuthContext = createContext<RootLoaderData>(noAuthPayload);

export type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const data = useLoaderData<RootLoader>();

  return (
    <AuthContext.Provider value={data as RootLoaderData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
