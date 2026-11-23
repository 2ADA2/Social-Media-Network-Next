import { API_URL } from "@/app/lib/config";
import { UserResponse } from "@/entities/user";
import { userResponseSchema } from "@/features/auth/me";

export const fetchUser = async (
  token: string,
): Promise<UserResponse | null> => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch (e) {
    console.error(
      `request error : ${e instanceof Error ? e.message : "unknown"}`,
    );
    return null;
  }

  if (!response.ok) {
    console.error(`request error : ${response.status} ${response.statusText}`);
    return null;
  }

  const result = userResponseSchema.safeParse(await response.json());

  if (!result.success) {
    console.error(`schema error: ${result.error.message}`);
    return null;
  }

  return result.data;
};
