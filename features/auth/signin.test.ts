import { beforeEach, describe, expect, test, vi } from "vitest";
import { signinRequest } from "./signin";

const mockSigninResponse = {
  user: {
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
  },
  token: "access-token",
  refreshToken: "refresh-token",
  expiresIn: 7200,
  refreshTokenExpiresAt: "2026-12-03T09:19:56.849Z",
};

describe("signinRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("Sends POST request and returns signin response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockSigninResponse,
    } as Response);

    const params = {
      email: "helena@example.com",
      password: "password123",
    };

    const result = await signinRequest(params);

    expect(fetchMock).toHaveBeenCalledWith("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });

    expect(result).toEqual(mockSigninResponse);
  });

  test("throws error when request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    } as Response);

    await expect(
      signinRequest({
        email: "helena@example.com",
        password: "wrong-password",
      }),
    ).rejects.toThrow("Signin request error: Invalid credentials");
  });

  test("throws error when response does not match schema", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockSigninResponse,
        expiresIn: "7200",
      }),
    } as Response);

    await expect(
      signinRequest({
        email: "helena@example.com",
        password: "password123",
      }),
    ).rejects.toThrow("Schema validation error");
  });
});
