import { apiClient } from "@/shared/api/api-client";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { AxiosError } from "axios";
import { fetchMe } from "./me";

vi.mock("@/shared/api/api-client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const mockUserResponse = {
  id: 1,
  username: "helena",
  email: "helena@example.com",
  profileImage: "/assets/user-helena.png",
  bio: null,
  firstName: "Helena",
  secondName: "Hills",
  description: "Travel and design enthusiast.",
  lastLogin: "2026-11-01T13:09:13.292Z",
  creationDate: "2026-10-06T23:16:36.812Z",
  modifiedDate: "2026-10-19T07:00:03.066Z",
};

describe("fetchMe", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  test("Sends GET request and returns mapped user", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: mockUserResponse,
    });

    const result = await fetchMe();

    expect(apiClient.get).toHaveBeenCalledWith("/api/me");

    expect(result).toEqual({
      id: "1",
      name: "Helena",
      username: "helena",
      surname: "Hills",
      email: "helena@example.com",
      avatar: "/assets/user-helena.png",
      description: "Travel and design enthusiast.",
    });
  });

  test("throws error when request fails", async () => {
    vi.mocked(apiClient.get).mockRejectedValue(
      new AxiosError("Request failed with status code 500"),
    );

    await expect(fetchMe()).rejects.toThrow("request error");
  });

  test("throws error when response does not match schema", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: {
        ...mockUserResponse,
        id: "invalid-id",
      },
    });

    await expect(fetchMe()).rejects.toThrow("schema error");
  });
});
