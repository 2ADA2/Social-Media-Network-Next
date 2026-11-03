import z from "zod";

const refreshResponseSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
});

type RefreshResponse = z.infer<typeof refreshResponseSchema>;

export const refreshRequest = async (): Promise<RefreshResponse> => {
  try {
    const res = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Refresh failed");
    }

    const data = await res.json();

    refreshResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`schema error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
