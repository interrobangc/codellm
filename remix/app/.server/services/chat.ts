import type {
  Agent,
  AgentEmitterChannels,
  AgentHistoryItem,
} from '@codellm/core';
import type { ServiceCommonParams } from './types.js';

import { EventEmitter } from 'events';
import { remember } from '@epic-web/remember';
import { AGENT_EMITTER_CHANNELS, log, newAgent } from '@codellm/core';
import {
  ChatInsert,
  Chat,
  User,
  ChatUpdate,
} from '@remix/.server/db/schema.js';
import { getConfig } from '@remix/.server/config.js';
import { chatModel } from '@remix/.server/models';
import { isError, newError } from '@remix/.server/errors';
import { getValidatedUser, validateUser } from './user.js';

export const ERRORS = {
  'chatService:noChat': {
    message: 'No chat found',
  },
} as const;

export const channelsToForward = Object.keys(
  AGENT_EMITTER_CHANNELS,
) as AgentEmitterChannels[];

const clients = remember(
  'chatsServiceClients',
  () => new Map<Chat['id'], Agent>(),
);

const eventStreamEmitter = remember(
  'eventStreamEmitter',
  () => new EventEmitter(),
);

export const getEventStreamEmitter = () => eventStreamEmitter;

// TODO: we're going to need channels for this eventually
const onAgentEmit =
  (chatId: User['id']) => async (params: AgentHistoryItem) => {
    const chat = await chatModel.getById(chatId);
    if (isError(chat)) return chat;
    await chat.addMessage(params);
    log('onAgentEmit emitting', 'debug', params);
    eventStreamEmitter.emit(`agent:${chatId}`, params);
  };

const onEmitListeners = (client: Agent, id: Chat['id']) =>
  channelsToForward.map((channel) => client.onEmit(channel, onAgentEmit(id)));

const offEmitListeners = (client: Agent, id: Chat['id']) =>
  channelsToForward.map((channel) => client.offEmit(channel, onAgentEmit(id)));

const clientCreationLocks = remember(
  'agentClientCreationLocks',
  () => new Map<Chat['id'], Promise<Agent>>(),
);

/**
 * This could be called simultaneously by multiple requests, so we need to ensure
 * that we only create one client per chat. We use a lock to ensure that only one
 * request creates the client, and the others wait for it to be created.
 */
export const _getOrCreateClient = async (id: Chat['id']) => {
  const existingClient = clients.get(id);
  if (existingClient) return existingClient;

  let lock = clientCreationLocks.get(id);
  if (lock) return lock;
  const newLock = (async () => {
    const newClient = await newAgent(getConfig('codellm'), id.toString());
    if (isError(newClient)) {
      // eslint-disable-next-line no-console
      console.dir(newClient, { depth: null });
      throw newClient;
    }
    if (!newClient) throw newError({ code: 'chatService:noChat' });

    clients.set(id, newClient);
    offEmitListeners(newClient, id); // Remove any existing listeners
    onEmitListeners(newClient, id);
    clientCreationLocks.delete(id); // Remove the lock
    return newClient;
  })();

  clientCreationLocks.set(id, newLock);

  return newLock;
};

export type ChatCommonParams = ServiceCommonParams & {
  id: Chat['id'];
};

export const createChat = async (params: ServiceCommonParams) => {
  const user = await getValidatedUser(params);
  if (isError(user)) return user;

  const chat = await user.addChat({ name: 'new chat' });
  if (isError(chat)) return chat;

  const client = await _getOrCreateClient(chat.id);
  if (isError(client)) return client;
  if (!client) return newError({ code: 'chatService:noChat' });

  return { client, ...chat };
};

export const getChat = async ({ id, request }: ChatCommonParams) => {
  const chat = await chatModel.getById(id);
  if (isError(chat)) return chat;

  const client = await _getOrCreateClient(id);
  if (isError(client)) return client;

  return { client, ...chat };
};

export const deleteChat = async (params: ChatCommonParams) => {
  const chat = await getChat(params);
  if (isError(chat)) return chat;

  offEmitListeners(chat.client as Agent, params.id);
  await chat.destroy();
};

export const getChats = async (params: ServiceCommonParams) => {
  const user = await getValidatedUser(params);
  if (isError(user)) return user;

  return user.getChats();
};

export type UpdateChatParams = ChatCommonParams & {
  update: ChatUpdate;
};

export const updateChat = async ({ id, update }: UpdateChatParams) => {
  const chat = await chatModel.getById(id);
  if (isError(chat)) return chat;

  const updatedChat = await chat.update(update);
  eventStreamEmitter.emit(`chat:${id}`, updatedChat);
  return updatedChat;
};

export const getMostRecentChat = async (params: ServiceCommonParams) => {
  const user = await getValidatedUser(params);
  if (isError(user)) return user;

  const chats = await user.getChats();
  if (isError(chats)) return chats;

  return chats[0];
};

export type SendChatParams = ChatCommonParams & {
  message: string;
};

export const sendChat = async (params: SendChatParams) => {
  const chat = await getChat(params);
  if (isError(chat)) return chat;

  await updateChat({ ...params, update: { isLoading: true } });
  await chat.client.chat(params.message);
  await updateChat({ ...params, update: { isLoading: false } });
};
