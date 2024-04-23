import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockChat, mockUser, prismaMock } from '@remixTests/mocks';
import * as chats from './chats';

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

  it('should throw an error when chat is not found', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(null);
    const id = 'non-existent-id';
    await expect(chats.getChat({ id, request })).rejects.toThrow();
  });
});
