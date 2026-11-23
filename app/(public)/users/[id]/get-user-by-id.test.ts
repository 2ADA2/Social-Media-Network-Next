import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { getUserById } from "./get-user-by-id";
import { mapUser, type User } from "@/entities/user";
import { API_URL } from "@/app/lib/config";

vi.mock("@/app/lib/config", () => ({
  API_URL: "http://localhost:4000",
}));

vi.mock("@/entities/user", () => ({
  mapUser: vi.fn(),
}));

const makeRawUser = (overrides = {}) => ({
  id: 101,
  username: "john",
  email: "john@example.com",
  profileImage: null,
  bio: null,
  firstName: "John",
  secondName: "Doe",
  description: "Hello",
  lastLogin: "2024-01-01T00:00:00.000Z",
  creationDate: "2024-01-01T00:00:00.000Z",
  modifiedDate: "2024-01-01T00:00:00.000Z",
  ...overrides,
});

describe("getUserById", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test("Returns mapped user on successful response", async () => {
    const rawUser = makeRawUser();
    const mappedUser = { id: "101", name: "John", username: "john" } as User;

    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
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
      status: 500,
      statusText: "Internal Server Error",
    });

    const result = await getUserById("102");

    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/users/102`);
    expect(mapUser).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
  });

  test("Returns null without logging on 404", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const result = await getUserById("103");

    expect(result).toBeNull();
    expect(mapUser).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  test("Returns null if fetch throws an error", async () => {
    fetchMock.mockRejectedValue(new Error("Network error"));

    const result = await getUserById("104");

    expect(result).toBeNull();
    expect(mapUser).not.toHaveBeenCalled();
  });

  test("Returns null if json parsing fails", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const result = await getUserById("105");

    expect(result).toBeNull();
    expect(mapUser).not.toHaveBeenCalled();
  });

  test("Returns null if response does not match schema", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 106, username: "broken" }),
    });

    const result = await getUserById("106");

    expect(result).toBeNull();
    expect(mapUser).not.toHaveBeenCalled();
  });
});
