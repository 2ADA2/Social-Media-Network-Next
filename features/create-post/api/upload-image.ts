import { apiClient } from "@/shared/api/api-client";
import z from "zod";
import { AxiosError } from "axios";

const uploadImageResponseSchema = z.object({
  url: z.string(),
});

type UploadImageResponse = z.infer<typeof uploadImageResponseSchema>;

export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<UploadImageResponse>(
      "/api/upload-image",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    uploadImageResponseSchema.parse(data);

    return data.url;
  } catch (e) {
    if (e instanceof AxiosError) {
      throw new Error(`request error : ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
