"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function DashboardError(props: { error: Error & { digest?: string }; retry?: () => void; reset?: () => void }) {
  return <ErrorFallback {...props} />;
}
