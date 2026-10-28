import { apiClient } from '@/shared/api/api-client';

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post<{ url: string }>(
    '/api/upload-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return data.url;
};
