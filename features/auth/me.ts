import { apiClient } from '@/shared/api/api-client';
import { mapUser, type User, type UserResponse } from '@/entities/user';
import { queryOptions } from "@tanstack/react-query";

export const fetchMe = async (): Promise<User> => {
  const { data } = await apiClient.get<UserResponse>('/api/me');
  return mapUser(data);
};

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ['me'],
      queryFn: fetchMe,
      staleTime: 5 * 60 * 1000,
    }),
};
