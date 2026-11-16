import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import MockAdapter from "axios-mock-adapter";

vi.unmock("@/shared/api/api-client");

vi.mock("@/features/auth/refresh", () => ({
  refreshRequest: vi.fn(),
}));
vi.mock("@/features/auth/logout", () => ({
  fetchLogout: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));
vi.mock("../lib/get-cookie", () => ({
  getCookie: vi.fn(),
}));
vi.mock("../lib/update-token", () => ({
  default: vi.fn(),
}));

import { refreshRequest } from "@/features/auth/refresh";
import { fetchLogout } from "@/features/auth/logout";
import { redirect } from "next/navigation";
import { getCookie } from "../lib/get-cookie";
import updateToken from "../lib/update-token";
import { apiClient, setTokenRefreshCallback } from "./api-client";

const mock = new MockAdapter(apiClient);

describe("apiClient", () => {
  beforeEach(() => {
    mock.reset();
    vi.clearAllMocks();

    vi.mocked(getCookie).mockReturnValue("old-token");
    vi.mocked(refreshRequest).mockResolvedValue({
      token: "token",
      refreshToken: "refresh",
      expiresIn: 123,
    });
    vi.mocked(fetchLogout).mockResolvedValue(undefined as any);
  });

  afterEach(() => {
    mock.resetHistory();
  });

  test("Adds authorization from cookie", async () => {
    mock.onGet("/api/me").reply((config) => {
      expect(config.headers?.Authorization).toBe("Bearer old-token");
      return [200, { id: 1 }];
    });

    const res = await apiClient.get("/api/me");
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ id: 1 });
  });

  test("Doesn't add authorization if token is missing", async () => {
    vi.mocked(getCookie).mockReturnValue(undefined);

    mock.onGet("/api/me").reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined();
      return [200, {}];
    });

    await apiClient.get("/api/me");
  });

  test("Passes the request as is", async () => {
    mock.onPost("/api/create").reply(201, { ok: true });

    const res = await apiClient.post("/api/create");
    expect(res.status).toBe(201);
    expect(res.data).toEqual({ ok: true });
  });

  test("On 401, it performs a refresh and repeats the request with a new token", async () => {
    const seenTokens: (string | undefined)[] = [];

    mock.onGet("/api/me").reply((config) => {
      seenTokens.push(config.headers?.Authorization as string | undefined);
      return seenTokens.length === 1 ? [401] : [200, { id: 1 }];
    });

    const onRefreshed = vi.fn();
    setTokenRefreshCallback(onRefreshed);

    const res = await apiClient.get("/api/me");

    expect(res.status).toBe(200);
    expect(refreshRequest).toHaveBeenCalledTimes(1);
    expect(updateToken).toHaveBeenCalledWith("token");
    expect(onRefreshed).toHaveBeenCalledTimes(1);
    expect(fetchLogout).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  test("If 401 error after refreshing -> forceLogout", async () => {
    mock.onGet("/api/me").reply(401);

    await expect(apiClient.get("/api/me")).rejects.toBeTruthy();

    expect(fetchLogout).toHaveBeenCalledTimes(1);
    expect(updateToken).toHaveBeenCalledWith("");
    expect(redirect).toHaveBeenCalledWith("/");
  });
});
