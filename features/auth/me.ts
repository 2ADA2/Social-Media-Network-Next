import { apiClient } from "@/shared/api/api-client";
import { mapUser, type User, type UserResponse } from "@/entities/user";
import { queryOptions } from "@tanstack/react-query";
import z from "zod";
import { AxiosError } from "axios";

const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  profileImage: z.string().nullable(),
  bio: z.string().nullable(),
  firstName: z.string(),
  secondName: z.string(),
  description: z.string(),
  lastLogin: z.string(),
  creationDate: z.string(),
  modifiedDate: z.string(),
});

export const fetchMe = async (): Promise<User> => {
  try {
    const { data } = await apiClient.get<UserResponse>("/api/me");

    userResponseSchema.parse(data);

    return mapUser(data);
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};

export const userQueries = {
  me: () =>
    queryOptions({
      queryKey: ["me"],
      queryFn: fetchMe,
      staleTime: 5 * 60 * 1000,
    }),
};
