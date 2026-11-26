import { API_URL } from "@/app/lib/config";

export const fetchLogout = async () => {
  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("logout failed:" + res.status);
  }
};
