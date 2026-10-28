import { apiClient } from '@/shared/api/api-client';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { likePost, dislikePost, type LikeStatus } from './like-post-api';

vi.mock('@/shared/api/api-client', async () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

const mockLikeResponse: LikeStatus = {
  status: 'liked',
  postId: 42,
  newLikesCount: 5,
};

const mockDislikeResponse: LikeStatus = {
  status: 'disliked',
  postId: 42,
  newLikesCount: 4,
};

describe('likePost', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test('sends POST to /api/like with postId', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockLikeResponse });

    const result = await likePost(42);

    expect(apiClient.post).toHaveBeenCalledWith('/api/like', { postId: 42 });
    expect(result).toEqual(mockLikeResponse);
  });

  test('throws error when request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError('Request failed with status code 500'),
    );

    await expect(likePost(42)).rejects.toThrow();
  });
});

describe('dislikePost', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test('sends POST to /api/dislike with postId', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: mockDislikeResponse });

    const result = await dislikePost(42);

    expect(apiClient.post).toHaveBeenCalledWith('/api/dislike', {
      postId: 42,
    });
    expect(result).toEqual(mockDislikeResponse);
  });

  test('throws error when request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError('Request failed with status code 500'),
    );

    await expect(dislikePost(42)).rejects.toThrow();
  });
});
