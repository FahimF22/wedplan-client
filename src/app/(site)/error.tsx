"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function SiteError(props: { error: Error & { digest?: string }; retry?: () => void; reset?: () => void }) {
  return <ErrorFallback {...props} />;
}
