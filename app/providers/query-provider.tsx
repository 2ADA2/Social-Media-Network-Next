"use client";

import { setTokenRefreshCallback } from "@/shared/api/api-client";
import { createQueryClient } from "@/shared/api/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  const router = useRouter();

  useEffect(() => {
    setTokenRefreshCallback(() => {
      router.refresh();
    });

    return () => setTokenRefreshCallback(() => {});
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
