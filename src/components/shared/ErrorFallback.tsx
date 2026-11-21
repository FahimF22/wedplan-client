"use client";

import Link from "next/link";
import { useEffect } from "react";
import { RefreshCw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorFallback({ error, retry, reset }: { error: Error & { digest?: string }; retry?: () => void; reset?: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlert className="size-7" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred while loading this page. Please try again — if it keeps happening, come back in a few minutes.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => (retry ?? reset)?.()}><RefreshCw /> Try again</Button>
        <Button asChild variant="outline"><Link href="/">Go home</Link></Button>
      </div>
    </div>
  );
}
