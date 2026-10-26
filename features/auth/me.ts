import { apiClient } from '@/shared/api/api-client';
import type { User, UserResponse } from '@/entities/user';
import { queryOptions } from "@tanstack/react-query";

export const fetchMe = async (): Promise<User> => {
  const { data } = await apiClient.get<UserResponse>('/api/me');

  return {
    id: String(data.id),
    username: data.username,
    name: data.firstName ?? '',
    surname: data.secondName ?? '',
    email: data.email ?? '',
    avatar: data.profileImage ?? '',
    description: data.description ?? '',
  };
};

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ['me'],
      queryFn: fetchMe,
      staleTime: 5 * 60 * 1000,
    }),
};
