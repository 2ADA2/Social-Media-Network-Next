'use client';

import { Metadata } from "next";
import { Fallback } from "./_components/fallback";

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