import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  llmAgentMock,
  mockChat,
  newAgentMock,
  prismaMock,
} from '@remixTests/mocks';
import * as chats from './chats';

describe('getChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a new chat when called without an id', async () => {
    prismaMock.chat.create.mockResolvedValueOnce(mockChat);
    const chat = await chats.getChat();
    expect(chat).toEqual(expect.objectContaining(mockChat));
    expect(prismaMock.chat.create).toHaveBeenCalledTimes(1);
  });

  it('should return a chat when called with an id', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(mockChat);
    const chat = await chats.getChat(mockChat.id);
    expect(chat).toEqual(expect.objectContaining(mockChat));
    expect(prismaMock.chat.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should throw an error when chat is not found', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(null);
    await expect(chats.getChat('non-existent-id')).rejects.toThrow();
  });
});
