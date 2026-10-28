'use client';

import { Fallback } from "@/shared/ui/fallback";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Error | Sidekick Social',
  description: 'Something went wrong.',
};


export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <Fallback error={error} onReset={reset} />;
}