import type { User } from '@/entities/user';

interface SigninParams {
  email: string;
  password: string;
}

export interface SigninResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const signinRequest = async (
  params: SigninParams,
): Promise<SigninResponse> => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Auth unknown error');
  }

  return res.json();
};
