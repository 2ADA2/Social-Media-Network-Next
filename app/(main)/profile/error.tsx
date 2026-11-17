"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshRequest } from "@/features/auth/refresh";
import updateToken from "@/shared/lib/update-token";
import { ROUTES } from "@/app/lib/routes";

export default function ProfileError({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    if (error.message !== "UNAUTHORIZED") return;

    const handleRefresh = async () => {
      try {
        const data = await refreshRequest();
        updateToken(data.token);
        window.location.reload();
      } catch {
        router.push(ROUTES.SIGNIN);
      }
    };

    handleRefresh();
  }, [error, router]);

  if (error.message === "UNAUTHORIZED") {
    return null;
  }

  throw error;
}
