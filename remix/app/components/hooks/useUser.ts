import { useContext } from 'react';
import { AuthContext } from '@remix/components/AuthProvider';

export function useUser() {
  const context = useContext(AuthContext);

  return {
    hasAuth: !!context.user,
    user: context.user,
  };
}

export default useUser;
