import { useEffect } from 'react';
import { useParams, useRevalidator } from '@remix-run/react';

export const useParamRevalidate = (param: string) => {
  const params = useParams();
  const { revalidate } = useRevalidator();

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params[param]]);
};

export default useParamRevalidate;
