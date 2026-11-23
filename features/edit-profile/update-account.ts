import z from "zod";
import { AxiosError } from "axios";
import { apiClient } from "@/shared/api/api-client";
import type { UserResponse } from "@/entities/user";
import { userResponseSchema } from "../auth/me";

export interface UpdateAccountParams {
  currentPassword: string;
  email?: string;
  password?: string;
}

export interface UpdateAccountResponse {
  message: string;
  user: UserResponse;
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export const updateAccountResponseSchema = z.object({
  message: z.string(),
  user: userResponseSchema,
  token: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional(),
}) satisfies z.ZodType<UpdateAccountResponse>;

export const updateAccountRequest = async (
  params: UpdateAccountParams,
): Promise<UpdateAccountResponse> => {
  try {
    const { data } = await apiClient.put<UpdateAccountResponse>(
      "/api/account",
      params,
    );

    return updateAccountResponseSchema.parse(data);
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
