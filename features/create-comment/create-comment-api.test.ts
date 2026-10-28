import { apiClient } from '@/shared/api/api-client';
import type { CommentInterface } from '@/entities/comment/types';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createCommentApi } from './create-comment-api';

vi.mock('@/shared/api/api-client', async () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockComment = {
  id: 1,
  text: 'Hello',
  postId: 42,
  author: { id: 1, username: 'helena' },
  creationDate: '2024-01-01',
} as CommentInterface;

describe('createCommentApi', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test('Sends POST request with correct params', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockComment });

    const result = await createCommentApi({ postId: 42, text: 'Hello' });

    expect(apiClient.post).toHaveBeenCalledWith('/api/comments', {
      postId: 42,
      text: 'Hello',
    });
    expect(result).toEqual(mockComment);
  });

  test('throws error when request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError('Request failed with status code 500'),
    );

    await expect(
      createCommentApi({ postId: 42, text: 'Hello' }),
    ).rejects.toThrow();
  });
});
