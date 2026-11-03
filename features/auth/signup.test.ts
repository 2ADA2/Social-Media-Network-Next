import { beforeEach, describe, expect, test, vi } from "vitest";
import { signupRequest } from "./signup";

const mockSignupResponse = {
  message: "Registration successful",
  user: {
    id: 15,
    username: "rami-malek",
    email: "rami-malek@gmail.com",
    profileImage: null,
    bio: null,
    firstName: "Rami",
    secondName: "Malek",
    description: "",
    lastLogin: "2026-11-03T09:25:18.212Z",
    creationDate: "2026-11-03T09:25:18.212Z",
    modifiedDate: "2026-11-03T09:25:18.212Z",
  },
};

describe("signupRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("Sends POST request and returns signup response", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockSignupResponse,
    } as Response);

    const params = {
      email: "rami-malek@gmail.com",
      password: "password123",
      firstName: "Rami",
      secondName: "Malek",
    };

    const result = await signupRequest(params);

    expect(fetchMock).toHaveBeenCalledWith("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(params),
    });

    expect(result).toEqual(mockSignupResponse);
  });

  test("throws error when request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Email already exists" }),
    } as Response);

    await expect(
      signupRequest({
        email: "rami-malek@gmail.com",
        password: "password123",
        firstName: "Rami",
        secondName: "Malek",
      }),
    ).rejects.toThrow("request error: Email already exists");
  });

  test("throws error when response does not match schema", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockSignupResponse,
        user: {
          ...mockSignupResponse.user,
          id: "15",
        },
      }),
    } as Response);

    await expect(
      signupRequest({
        email: "rami-malek@gmail.com",
        password: "password123",
        firstName: "Rami",
        secondName: "Malek",
      }),
    ).rejects.toThrow("schema error");
  });
});
