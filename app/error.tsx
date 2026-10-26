'use client';

import { Fallback } from "@/shared/ui/fallback";


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Fallback error={error} onReset={reset} />;
}