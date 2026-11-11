import { apiClient } from "@/shared/api/api-client";
import type { UserResponse } from "@/entities/user";
import { AxiosError } from "axios";

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

export const updateAccountRequest = async (
  params: UpdateAccountParams,
): Promise<UpdateAccountResponse> => {
  try {
    const { data } = await apiClient.put<UpdateAccountResponse>(
      "/api/account",
      params,
    );
    return data;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`Network error: ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`Error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
