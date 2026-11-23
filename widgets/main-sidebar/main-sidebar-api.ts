import z from "zod";
import { API_URL } from "@/app/lib/config";
import {
  CommunityResponse,
  SuggestedPeopleResponse,
} from "@/features/sidebar/types";

export const suggestedPeopleResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  firstName: z.string().nullable(),
  secondName: z.string().nullable(),
  description: z.string().nullable(),
  photo: z.string().nullable(),
}) satisfies z.ZodType<SuggestedPeopleResponse>;

export const communityResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  photo: z.string().nullable(),
  membersCount: z.number(),
}) satisfies z.ZodType<CommunityResponse>;

const request = async (path: string, token: string): Promise<unknown> => {
  let res: Response;

  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 },
    });
  } catch (e) {
    throw new Error(
      `request error : ${e instanceof Error ? e.message : "unknown"}`,
    );
  }

  if (!res.ok) {
    throw new Error(`request error : ${res.status} ${res.statusText}`);
  }

  return res.json();
};

export const fetchSuggestedPeople = async (
  token: string,
): Promise<SuggestedPeopleResponse[]> => {
  const data = await request("/getSuggested", token);

  try {
    return z.array(suggestedPeopleResponseSchema).parse(data);
  } catch (e) {
    throw new Error(
      `schema error: ${e instanceof Error ? e.message : "unknown"}`,
    );
  }
};

export const fetchCommunities = async (
  token: string,
): Promise<CommunityResponse[]> => {
  const data = await request("/groups", token);

  try {
    return z.array(communityResponseSchema).parse(data);
  } catch (e) {
    throw new Error(
      `schema error: ${e instanceof Error ? e.message : "unknown"}`,
    );
  }
};
