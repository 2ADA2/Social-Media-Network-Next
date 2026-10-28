import { apiClient } from '@/shared/api/api-client';
import type { Post } from '@/entities/post/types';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createPostRequest } from './create-post';

vi.mock('@/shared/api/api-client', async () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockPost: Post = {
  id: 1,
  title: 'My post',
  content: 'Hello world',
  author: { id: 1, username: 'helena' },
  creationDate: '2024-01-01',
  likesCount: 0,
  commentsCount: 0,
  likedByUsers: [],
} as unknown as Post;

describe('createPostRequest', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test('Sends POST request', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockPost });

    const result = await createPostRequest({
      title: 'My post',
      content: 'Content',
    });

    expect(apiClient.post).toHaveBeenCalledWith('/api/posts', {
      title: 'My post',
      content: 'Content',
    });
    expect(result).toEqual(mockPost);
  });

  test('Throws error if request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new AxiosError());

    await expect(
      createPostRequest({ title: 't', content: 'c' }),
    ).rejects.toThrow();
  });
});
