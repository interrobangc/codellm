import { useContext } from 'react';
import { AuthContext } from '@remix/components/AuthProvider';

export function useUser() {
  return useContext(AuthContext);
}

export default useUser;
