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

const signupResponseSchema = z.object({
  message: z.string(),
  user: userSchema,
});

type SignupResponse = z.infer<typeof signupResponseSchema>;

interface SignupParams {
  email: string;
  password: string;
  firstName: string;
  secondName: string;
}

export const signupRequest = async (
  params: SignupParams,
): Promise<SignupResponse> => {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Signup failed");
    }

    const data = await res.json();

    signupResponseSchema.parse(data);

    return data;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`schema error: ${e.message}`);
    } else if (e instanceof Error) {
      throw new Error(`request error: ${e.message}`);
    }

    throw new Error("unknown error");
  }
};
