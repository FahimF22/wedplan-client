import { Loader2 } from "lucide-react";

export default function SiteLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-32 text-muted-foreground">
      <Loader2 className="size-8 animate-spin text-primary" />
      <p className="text-sm">Loading…</p>
    </div>
  );
}
