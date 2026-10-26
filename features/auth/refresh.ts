interface RefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export const refreshRequest = async (): Promise<RefreshResponse> => {
  const res = await fetch('/api/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Refresh failed');
  }

  return res.json();
};
