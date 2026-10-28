import { apiClient } from '@/shared/api/api-client';
import { mapUser, type User, type UserResponse } from '@/entities/user';
import z from 'zod';
import { expect } from 'vitest';
import { AxiosError } from 'axios';

// export interface UpdateProfileParams {
//   username?: string;
//   firstName?: string;
//   secondName?: string;
//   description?: string;
//   profileImage?: string;
// }

const updateProfileRequestSchema = z.object({
  username: z.string().optional(),
  firstName: z.string().optional(),
  secondName: z.string().optional(),
  description: z.string().optional(),
  profileImage: z.string().optional(),
})

type UpdateProfileParams = z.infer<typeof updateProfileRequestSchema>;

export const updateProfileRequest = async (
  params: UpdateProfileParams,
): Promise<User | undefined> => {
  try {
    const { data } = await apiClient.put<UserResponse>('/api/profile', params);

    updateProfileRequestSchema.parse(data);

    return mapUser(data);
  } catch(e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    } 

    throw new Error("unknown error");
  }
};
