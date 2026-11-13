export default function updateToken(token: string) {
  (">", token);
  if (token === "") {
    document.cookie = "token=; Max-Age=0; path=/";
  }
  document.cookie = `token=${token}; path=/; max-age=7200; SameSite=Lax;`;
}
