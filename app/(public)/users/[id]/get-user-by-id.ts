import { cache } from "react";
import { API_URL } from "@/app/lib/config";
import { mapUser, User } from "@/entities/user";

export const MIN_ID = 100;

export const getUserById = cache(async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);

    if (!response.ok) {
      return null;
    }

    const user = await response.json();

    return mapUser(user) || null;
  } catch {
    return null;
  }
});
