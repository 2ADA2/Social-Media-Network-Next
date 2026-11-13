import { useQuery, useQueryClient } from "@tanstack/react-query";
import { describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { QueryProvider } from "./query-provider";
import { useRouter } from "next/router";

const TestConsumer = ({ queryKey = ["test-key"] }: { queryKey?: string[] }) => {
  const { data, isPending } = useQuery({
    queryKey,
    queryFn: async () => Promise.resolve("Hello from Query"),
    retry: false,
    staleTime: Infinity,
  });

  if (isPending) return <div data-testid="loading">Loading...</div>;
  return <div data-testid="data">{data}</div>;
};

describe("QueryProvider", () => {
  test("Provides a working QueryClient to child components", async () => {
    const screen = await render(
      <QueryProvider>
        <TestConsumer />
      </QueryProvider>,
    );

    await expect.poll(() => screen.getByTestId("data").query()).not.toBeNull();
    await expect
      .element(screen.getByTestId("data"))
      .toHaveTextContent("Hello from Query");
  });

  test("Provides the same QueryClient", async () => {
    const clients: unknown[] = [];

    const ClientTracker = () => {
      const client = useQueryClient();
      clients.push(client);
      return <div data-testid="tracker">tracked</div>;
    };

    const screen = await render(
      <QueryProvider>
        <ClientTracker />
      </QueryProvider>,
    );

    await screen.rerender(
      <QueryProvider>
        <ClientTracker />
      </QueryProvider>,
    );

    expect(clients).toHaveLength(2);
    expect(clients[0]).toBe(clients[1]);
  });

  test("Creates an isolated QueryClient for each provider", async () => {
    const clients: unknown[] = [];

    const ClientTracker = () => {
      const client = useQueryClient();
      clients.push(client);
      return null;
    };

    await render(
      <>
        <QueryProvider>
          <ClientTracker />
        </QueryProvider>
        <QueryProvider>
          <ClientTracker />
        </QueryProvider>
      </>,
    );

    expect(clients).toHaveLength(2);
    expect(clients[0]).not.toBe(clients[1]);
  });
});
