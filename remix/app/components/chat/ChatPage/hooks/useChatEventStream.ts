import { useEffect } from 'react';
import { useResolvedPath, useRevalidator } from '@remix-run/react';
import { useEventStream } from '@remix-sse/client';

export const useChatEventStream = <T>(channel: string) => {
  const { pathname } = useResolvedPath('./emitter');

  const eventStream = useEventStream(pathname, {
    channel,
    deserialize: (raw) => JSON.parse(raw) as T,
    returnLatestOnly: true,
  });

  const revalidator = useRevalidator();

  useEffect(() => {
    if (eventStream) {
      revalidator.revalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventStream]);

  return {
    eventStream,
  };
};
