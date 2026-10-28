export const fetchLogout = async () => {
  const res = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('logout failed:' + res.status);
  }
};

