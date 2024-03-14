import type { LoaderFunction } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';
import { getEventStreamEmitter } from '@remix/.server/chats.js';

export const loader: LoaderFunction = ({ request }) => {
  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    const eventStreamEmitter = getEventStreamEmitter();
    // eventStreamEmitter.on('agent', (params) => send(JSON.stringify(params)));
    function handleChatMessage(params: unknown) {
      console.log('handleChatMessage', params);
      send(JSON.stringify(params));
    }
    eventStreamEmitter.addListener('agent', handleChatMessage);

    return () => {
      eventStreamEmitter.removeListener('agent', handleChatMessage);
    };
  });
};
