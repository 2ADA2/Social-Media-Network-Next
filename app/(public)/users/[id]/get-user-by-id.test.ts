import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getUserById } from "./get-user-by-id";
import { mapUser, User } from "@/entities/user";
import { API_URL } from "@/app/lib/config";

vi.mock("@/app/lib/config", () => ({
  API_URL: "http://localhost:4000",
}));

vi.mock("@/entities/user", () => ({
  mapUser: vi.fn(),
}));

describe("getUserById", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("Returns mapped user on successful response", async () => {
    const rawUser = { id: 101, firstName: "John", username: "john" };
    const mappedUser = { id: "101", name: "John", username: "john" } as User;

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => rawUser,
    });
    vi.mocked(mapUser).mockReturnValue(mappedUser);

    const result = await getUserById("101");

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/101`);
    expect(mapUser).toHaveBeenCalledWith(rawUser);
    expect(result).toEqual(mappedUser);
  });

  test("Returns null if response is not ok", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
    });

    const result = await getUserById("102");

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/102`);
    expect(mapUser).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  test("Returns null if fetch throws an error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const result = await getUserById("104");

    expect(result).toBeNull();
  });

  test("Returns null if json parsing fails", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const result = await getUserById("105");

    expect(result).toBeNull();
  });
});
