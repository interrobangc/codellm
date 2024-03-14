import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';
import { getEventStreamEmitter } from '@remix/.server/chats.js';

export const loader: LoaderFunction = ({ params, request }) => {
  if (!params.chatId) return json({ error: 'Invalid chatId' }, { status: 400 });
  const { chatId } = params;

  return new EventStream(request, (send) => {
    const eventStreamEmitter = getEventStreamEmitter();
    function handleChatMessage(params: unknown) {
      console.log('handleChatMessage', params);
      send(JSON.stringify(params));
    }
    eventStreamEmitter.addListener(`agent:${chatId}`, handleChatMessage);

    return () => {
      eventStreamEmitter.removeListener(`agent:${chatId}`, handleChatMessage);
    };
  });
};
