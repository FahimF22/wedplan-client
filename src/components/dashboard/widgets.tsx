import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{title}</h1>
        {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
    </div>
  );
}

const tones = {
  sage: "bg-primary/10 text-primary",
  gold: "bg-[var(--gold)]/15 text-[oklch(0.5_0.1_70)]",
  rose: "bg-[oklch(0.6_0.12_15)]/10 text-[oklch(0.5_0.14_15)]",
  slate: "bg-[oklch(0.55_0.04_250)]/10 text-[oklch(0.45_0.05_250)]",
  green: "bg-success/12 text-success",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "sage",
  hint,
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  hint?: string;
}) {
  return (
    <Card className="gap-0 py-0">
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-3xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <div className={cn("grid size-11 shrink-0 place-items-center rounded-xl", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-[112px] rounded-xl" />
      ))}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  pending: "bg-warning/15 text-[oklch(0.5_0.12_65)] border-warning/30",
  approved: "bg-success/12 text-success border-success/30",
  accepted: "bg-success/12 text-success border-success/30",
  completed: "bg-success/12 text-success border-success/30",
  active: "bg-success/12 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/25",
  failed: "bg-destructive/10 text-destructive border-destructive/25",
  blocked: "bg-destructive/10 text-destructive border-destructive/25",
  cancelled: "bg-muted text-muted-foreground border-border",
  expired: "bg-muted text-muted-foreground border-border",
  inactive: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize", statusStyles[status] ?? "", className)}>
      {status}
    </Badge>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
      <div className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 font-sans text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
      <p className="font-medium text-destructive">{message}</p>
      {onRetry ? (
        <button onClick={onRetry} className="mt-3 text-sm font-semibold text-primary underline-offset-4 hover:underline">
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
