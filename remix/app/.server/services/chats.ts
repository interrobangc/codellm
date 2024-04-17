import type {
  Agent,
  AgentEmitterChannels,
  AgentHistoryItem,
} from '@codellm/core';
import type { Prisma } from '@prisma/client';

import { EventEmitter } from 'events';
import { remember } from '@epic-web/remember';
import { AGENT_EMITTER_CHANNELS, isError, log, newAgent } from '@codellm/core';
import omit from 'lodash/omit';
import { chatModel, userModel } from '../models/index.js';
import { getConfig } from '../config.js';
import { getUser } from './user.js';

const user = getUser();

export const channelsToForward = Object.keys(
  AGENT_EMITTER_CHANNELS,
) as AgentEmitterChannels[];

const clients = remember('chatsServiceClients', () => new Map<string, Agent>());

const eventStreamEmitter = remember(
  'eventStreamEmitter',
  () => new EventEmitter(),
);

export const getEventStreamEmitter = () => eventStreamEmitter;

// TODO: we're going to need channels for this eventually
const onAgentEmit = (chatId: string) => async (params: AgentHistoryItem) => {
  const chat = await chatModel.getById(chatId);
  if (!chat) {
    throw new Error('Chat not found');
  }
  await chat.addMessage(params);
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit(`agent:${chatId}`, params);
};

const onEmitListeners = (client: Agent, id: string) =>
  channelsToForward.map((channel) => client.onEmit(channel, onAgentEmit(id)));

const offEmitListeners = (client: Agent, id: string) =>
  channelsToForward.map((channel) => client.offEmit(channel, onAgentEmit(id)));

const clientCreationLocks = remember(
  'agentClientCreationLocks',
  () => new Map<string, Promise<Agent>>(),
);

/**
 * This could be called simultaneously by multiple requests, so we need to ensure
 * that we only create one client per chat. We use a lock to ensure that only one
 * request creates the client, and the others wait for it to be created.
 *
 * @param {string} id The chat id
 * @returns {Promise<Agent>} The client for the chat
 */
export const getOrCreateClient = async (id: string) => {
  const existingClient = clients.get(id);
  if (existingClient) return existingClient;

  let lock = clientCreationLocks.get(id);
  if (!lock) {
    lock = (async () => {
      const newClient = await newAgent(await getConfig(), id);
      if (isError(newClient)) {
        throw newClient;
      }
      clients.set(id, newClient);
      offEmitListeners(newClient, id); // Remove any existing listeners
      onEmitListeners(newClient, id);
      clientCreationLocks.delete(id); // Remove the lock
      return newClient;
    })();
    clientCreationLocks.set(id, lock);
  }

  return lock;
};

export const getChat = async (id?: string) => {
  let client: Agent | undefined;
  let chat: chatModel.ChatModel | undefined;
  if (id) {
    chat = await chatModel.getById(id);
    if (!chat) {
      throw new Error('Chat not found');
    }
    client = await getOrCreateClient(id);
  } else {
    chat = await user.addChat({ name: 'new chat' });
    if (!chat) {
      throw new Error('Chat not found');
    }

    client = await getOrCreateClient(chat.id);
  }

  return { client, ...chat };
};

export const deleteChat = async (id: string) => {
  const chat = await getChat(id);
  if (chat) {
    offEmitListeners(chat.client, id);
    await chat.remove();
  }
};

export const getChats = () => user.getChats();

export const updateChat = async (
  id: string,
  update: Prisma.ChatUpdateInput,
) => {
  const chat = await chatModel.getById(id);
  if (!chat) {
    throw new Error('Chat not found');
  }

  const updatedChat = await chat.update(update);
  eventStreamEmitter.emit(`chat:${id}`, updatedChat);
  return updatedChat;
};

export const getMostRecentChat = async () => {
  const chats = await user.getChats();

  return chats[0];
};

export const sendChat = async (chatId: string, userMessage: string) => {
  const chat = await getChat(chatId);
  if (!chat) throw new Error('Chat not found');

  await updateChat(chatId, { isLoading: true });
  await chat.client.chat(userMessage);
  await updateChat(chatId, { isLoading: false });
};
