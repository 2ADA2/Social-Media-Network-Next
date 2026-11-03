export default function updateToken(token: string) {
  document.cookie = `token=${token}; path=/; max-age=7200; SameSite=Lax;`;
}
