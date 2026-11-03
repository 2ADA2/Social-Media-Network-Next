import type { User } from '@/entities/user';
import type { useUser } from '@/entities/user/model/use-user';
import { useAuth } from '@/features/auth/use-auth';
import { vi } from 'vitest';

export type UseUserType = ReturnType<typeof useUser>;
export type UseAuthType = ReturnType<typeof useAuth>;

export const authUser = {
  user: { id: '1', name: 'Alice', avatar: '/avatar.png' } as User,
  setUser: vi.fn(),
} as UseUserType;

export const nullUser = {
  user: null,
  setUser: vi.fn(),
};

export const authed = {
  isAuth: true,
} as UseAuthType;
