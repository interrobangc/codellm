import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockChat, mockUser, prismaMock } from '@remixTests/mocks';
import { expectError } from '@remixTests/tools';
import * as chats from './chat';

const request = new Request('http://localhost:3000');

describe('getChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    prismaMock.user.findUnique.mockResolvedValue(mockUser);
  });

  it('should return a chat when called with an id', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(mockChat);
    const { id } = mockChat;
    const chat = await chats.getChat({ id, request });
    expect(chat).toEqual(expect.objectContaining(mockChat));
    expect(prismaMock.chat.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should return an error when chat is not found', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(null);
    const id = 'non-existent-id';
    const chat = await chats.getChat({ id, request });
    expectError(chat, 'chatModel:notFound');
  });
});
