import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchUser } from "./fetch-user";
import { API_URL } from "@/app/lib/config";

const makeUserResponse = (overrides = {}) => ({
  id: 1,
  username: "helenahills",
  email: "helena.hills@social.co",
  profileImage: "/assets/user-helena.png",
  bio: null,
  firstName: "Helena",
  secondName: "Hills",
  description: "Travel and design enthusiast.",
  lastLogin: "2026-11-16T14:40:30.881Z",
  creationDate: "2026-10-22T00:47:54.401Z",
  modifiedDate: "2026-11-23T10:27:26.063Z",
  ...overrides,
});

describe("fetchUser", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  test("Returns user on successful response", async () => {
    const user = makeUserResponse();

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => user,
    });

    const result = await fetchUser("test-token");

    expect(result).toEqual(user);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/me`, {
      headers: { Authorization: "Bearer test-token" },
      cache: "no-store",
    });
  });

  test("Throws request error if response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    });

    await expect(fetchUser("bad-token")).rejects.toThrow(
      "request error : 401 Unauthorized",
    );
  });

  test("Throws request error if fetch throws", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    await expect(fetchUser("test-token")).rejects.toThrow(
      "request error : Network error",
    );
  });

  test("Throws schema error if response does not match schema", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => makeUserResponse({ id: "not-a-number" }),
    });

    await expect(fetchUser("test-token")).rejects.toThrow("schema error");
  });

  test("Throws unknown error if a non-Error value is thrown", async () => {
    fetchMock.mockRejectedValue("boom");

    await expect(fetchUser("test-token")).rejects.toThrow("unknown error");
  });
});
