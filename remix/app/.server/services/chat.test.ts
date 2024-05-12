import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mockChat, mockUser, dbQueryMock } from '@remixTests/mocks';
import { expectError } from '@remixTests/tools';
import * as chats from './chat';

const request = new Request('http://localhost:3000');

describe('getChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    dbQueryMock.userSchema.findFirst.mockResolvedValue(mockUser);
  });

  it('should return a chat when called with an id', async () => {
    dbQueryMock.chatSchema.findFirst.mockResolvedValueOnce(mockChat);
    const { id } = mockChat;
    const chat = await chats.getChat({ id, request });
    expect(chat).toEqual(expect.objectContaining(mockChat));
    expect(dbQueryMock.chatSchema.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should return an error when chat is not found', async () => {
    dbQueryMock.chatSchema.findFirst.mockResolvedValueOnce(null);
    const id = 'non-existent-id';
    const chat = await chats.getChat({ id, request });
    expectError(chat, 'chatModel:notFound');
  });
});
