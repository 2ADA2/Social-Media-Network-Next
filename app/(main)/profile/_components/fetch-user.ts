import { ZodError } from "zod";
import { API_URL } from "@/app/lib/config";
import { UserResponse } from "@/entities/user";
import { userResponseSchema } from "@/features/auth/me";

export const fetchUser = async (token: string): Promise<UserResponse> => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return userResponseSchema.parse(data);
  } catch (e) {
    if (e instanceof ZodError) {
      throw new Error(`schema error: ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`request error : ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
