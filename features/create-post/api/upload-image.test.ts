import { apiClient } from '@/shared/api/api-client';
import { AxiosError } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { uploadImage } from './upload-image';
import { createFile } from '@/test/create=file';

vi.mock('@/shared/api/api-client', async () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe('uploadImage', () => {
  beforeEach(() => {
    vi.mocked(apiClient.post).mockReset();
  });

  test('Sends POST request and returns url', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { url: 'https://cdn.example.com/img.png' },
    });

    const file = createFile({
      name: 'avatar.png',
      type: 'image/png',
      sizeInBytes: 1024,
    });

    const url = await uploadImage(file);

    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/upload-image',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    expect(url).toBe('https://cdn.example.com/img.png');
  });

  test('Throws if request fails', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(
      new AxiosError('Request failed with status code 500'),
    );

    const file = createFile({
      name: 'avatar.png',
      type: 'image/png',
      sizeInBytes: 1024,
    });

    await expect(uploadImage(file)).rejects.toThrow();
  });
});
