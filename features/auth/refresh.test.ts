import { beforeEach, describe, expect, test, vi } from "vitest";
import { refreshRequest } from "./refresh";

const mockRefreshResponse = {
  token: "access-token",
  refreshToken: "refresh-token",
  expiresIn: 7200,
};

describe("refreshRequest", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("Sends POST request and returns refresh tokens", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockRefreshResponse,
    } as Response);

    const result = await refreshRequest();

    expect(fetchMock).toHaveBeenCalledWith("/api/refresh", {
      method: "POST",
      credentials: "include",
    });

    expect(result).toEqual(mockRefreshResponse);
  });

  test("throws error when request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    await expect(refreshRequest()).rejects.toThrow(
      "schema error: Refresh failed",
    );
  });

  test("throws error when response does not match schema", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        ...mockRefreshResponse,
        expiresIn: "7200",
      }),
    } as Response);

    await expect(refreshRequest()).rejects.toThrow("schema error");
  });
});
