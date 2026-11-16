import { beforeEach, afterEach, describe, expect, test, vi } from "vitest";

vi.mock("../lib/get-cookie", () => ({
  getCookie: vi.fn(),
}));

import { getCookie } from "../lib/get-cookie";
import { graphqlClient } from "./graphql-client";

describe("graphqlClient", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);

    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ data: { hello: "world" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Adds authorization to headers if exists", async () => {
    vi.mocked(getCookie).mockReturnValue("my-secret-token");

    await graphqlClient.request("query { hello }");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url.toString()).toBe("http://localhost:4000/api/graphql");
    expect(options.method).toBe("POST");

    const headers = options.headers as Headers;
    expect(headers.get("Authorization")).toBe("Bearer my-secret-token");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(JSON.parse(options.body)).toEqual({
      query: "query { hello }",
    });
  });

  test("Doesn't add authorizations if token is not exists", async () => {
    vi.mocked(getCookie).mockReturnValue(undefined);

    await graphqlClient.request("query { hello }");

    const [, options] = fetchMock.mock.calls[0];

    expect(options.headers?.Authorization).toBeUndefined();
  });
});
