import type { User } from '@/entities/user';

interface SignupParams {
  email: string;
  password: string;
  firstName: string;
  secondName: string;
}

interface SignupResponse {
  message: string;
  user: User;
}

export const signupRequest = async (
  params: SignupParams,
): Promise<SignupResponse> => {
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Signup failed');
  }

  return res.json();
};
