import type { Agent, AgentHistoryItem } from '@codellm/core';

import { EventEmitter } from 'events';
import { isError, log, newAgent } from '@codellm/core';
import config from '../../../config';

export type ChatItem = {
  client: Agent;
  id: string;
  name: string;
};

export type Chats = Map<string, ChatItem>;

const chats: Chats = new Map();

export const eventStreamEmitter = new EventEmitter();

export const getChatsLength = () => chats.size;

// TODO: we're going to need channels for this eventually
const onAgentEmit = (params: AgentHistoryItem) => {
  log('onAgentEmit emitting', 'debug', params);
  eventStreamEmitter.emit('agent', params);
};

export const initChat = async (id?: string) => {
  let currentId: string;
  let currentChat: ChatItem | undefined;

  log('initChat', 'debug', { chats, id });

  if (id) {
    currentChat = chats.get(id);
    if (currentChat) {
      currentChat.client.offEmit(onAgentEmit);
    }
    currentId = id;
  } else {
    currentId = crypto.randomUUID();
  }

  const agentRes = await newAgent(config, currentId);
  if (isError(agentRes)) {
    throw agentRes;
  }

  agentRes.onEmit(onAgentEmit);
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

export const getChats = () => Array.from(chats.values());

export const getMostRecentChat = () => {
  const chatIds = Array.from(chats.keys());
  const mostRecentChatId = chatIds[chatIds.length - 1];
  return chats.get(mostRecentChatId);
};
