import { beforeEach, describe, expect, it, vi } from 'vitest';

import { llmAgentMock, prismaMock } from '@remixTests/mocks';
import * as chats from './chats';

vi.mock('@remix/.server/models/prisma', () => ({
  prisma: prismaMock,
}));

vi.mock('@codellm/core', () => ({
  newAgent: llmAgentMock,
}));

const mockChat = {
  id: 'fake-chat-id-0',
  name: 'new chat',
  userId: 'fake-user-id-0',
  isLoading: false,
  createdAt: new Date('2024-03-16T16:08:27.224Z'),
  updatedAt: new Date('2024-03-16T16:08:27.224Z'),
};

const additionalChatProperties = [
  'addMessaage',
  'getMessages',
  'remove',
  'update',
  'client',
];

describe('getChat', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should return a new chat when called without an id', async () => {
    prismaMock.chat.create.mockResolvedValueOnce(mockChat);
    const chat = await chats.getChat();
    expect(chat).toEqual(expect.objectContaining(mockChat));
  });

  it('should return a chat when called with an id', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(mockChat);
    const chat = await chats.getChat({ id: mockChat.id });
    expect(chat).toEqual(expect.objectContaining(mockChat));
  });

  it('should throw an error when chat is not found', async () => {
    prismaMock.chat.findUnique.mockResolvedValueOnce(null);
    await expect(chats.getChat({ id: 'non-existent-id' })).rejects.toThrow();
  });
});
