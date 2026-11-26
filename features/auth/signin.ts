import { API_URL } from "@/app/lib/config";
import z from "zod";

const userSchema = z.object({
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

const signinResponseSchema = z.object({
  user: userSchema,
  token: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
  refreshTokenExpiresAt: z.string(),
});

type SigninResponse = z.infer<typeof signinResponseSchema>;

interface SigninParams {
  email: string;
  password: string;
}

export const signinRequest = async (
  params: SigninParams,
): Promise<SigninResponse> => {
  try {
    console.log(`${API_URL}/login`);
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Failed to sign in");
    }

    const data = await res.json();

    signinResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`Schema validation error: ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`Signin request error: ${e.message}`);
    }

    throw new Error("Unknown signin error");
  }
};
