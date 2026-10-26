import type { User, UserResponse } from '@/entities/user';

export const mapUser = (data: UserResponse): User => {
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
