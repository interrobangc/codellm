import type { Agent, AgentHistoryItem } from '@codellm/core';

import { EventEmitter } from 'events';
import { isError, log, newAgent } from '@codellm/core';
import omit from 'lodash/omit';
import { getConfig } from './config';

export type ChatItem = {
  client: Agent;
  id: string;
  name: string;
};

export type Chats = Map<string, ChatItem>;

const chats: Chats = new Map();
const eventStreamEmitter = new EventEmitter();

export const getEventStreamEmitter = () => eventStreamEmitter;
export const getChatsLength = () => chats.size;

// TODO: we're going to need channels for this eventually
const onAgentEmit = (chatId: string) => (params: AgentHistoryItem) => {
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit(`agent:${chatId}`, params);
};

export const initChat = async (id?: string) => {
  let currentId: string;
  let currentChat: ChatItem | undefined;

  log('initChat', 'debug', { chats, id });

  if (id) {
    currentChat = chats.get(id);
    if (currentChat) {
      currentChat.client.offEmit(onAgentEmit(id));
    }
    currentId = id;
  } else {
    currentId = crypto.randomUUID();
  }

  const agentRes = await newAgent(await getConfig(), currentId);
  if (isError(agentRes)) {
    throw agentRes;
  }

  agentRes.onEmit(onAgentEmit(currentId));
  const name = currentChat?.name || `chat-${getChatsLength() + 1}`;
  chats.set(currentId, {
    id: currentId,
    client: agentRes,
    name,
  });

  const retAgent = chats.get(currentId);
  if (!retAgent) {
    throw new Error('Chat not found');
  }
  return retAgent;
};

export const getChat = (id: string) => {
  const agent = chats.get(id);
  if (agent) return agent;

  return initChat(id);
};

export const getClientSafeChat = (id: string) => {
  const chat = chats.get(id);
  if (!chat) {
    throw new Error('Chat not found');
  }

  return omit(chat, 'client');
};

export const getChats = () => Array.from(chats.values());

export const getClientSafeChats = () => {
  return getChats().map((chat) => getClientSafeChat(chat.id));
};

export const getMostRecentChat = () => {
  const chatIds = Array.from(chats.keys());
  const mostRecentChatId = chatIds[chatIds.length - 1];
  return chats.get(mostRecentChatId);
};
