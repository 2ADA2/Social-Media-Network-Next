import { cache } from "react";
import { API_URL } from "@/app/lib/config";
import { User } from "@/entities/user";

export const MIN_ID = 100;

export const getUser = cache(async (id: string): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    const user = await response.json();

    return user;
  } catch {
    return null;
  }
});
