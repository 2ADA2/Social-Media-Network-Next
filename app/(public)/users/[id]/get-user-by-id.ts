import { cache } from "react";
import { API_URL } from "@/app/lib/config";
import { mapUser, type User, type UserResponse } from "@/entities/user";
import { userResponseSchema } from "@/features/auth/me";

export const MIN_ID = 100;

export const getUserById = cache(async (id: string): Promise<User | null> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`);
  } catch (e) {
    console.error(
      `request error : ${e instanceof Error ? e.message : "unknown"}`,
    );
    return null;
  }

  if (!response.ok) {
    if (response.status !== 404) {
      console.error(
        `request error : ${response.status} ${response.statusText}`,
      );
    }
    return null;
  }

  try {
    const result = userResponseSchema.safeParse(await response.json());

    if (!result.success) {
      console.error(`schema error: ${result.error.message}`);
      return null;
    }

    return mapUser(result.data);
  } catch (e) {
    console.error(`parse error: ${e instanceof Error ? e.message : "unknown"}`);
    return null;
  }
});
