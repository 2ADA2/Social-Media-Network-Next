import z from "zod";
import { AxiosError } from "axios";
import { apiClient } from "@/shared/api/api-client";

export interface UploadImageResponse {
  url: string;
}

export const uploadImageResponseSchema = z.object({
  url: z.string(),
}) satisfies z.ZodType<UploadImageResponse>;

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await apiClient.post<UploadImageResponse>(
      "/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return uploadImageResponseSchema.parse(data).url;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
