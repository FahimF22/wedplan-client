"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, Gem, Plus, Store, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageHeader, StatCard, StatGridSkeleton, StatusBadge } from "@/components/dashboard/widgets";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { formatDate, formatEventDate } from "@/lib/constants";
import type { Booking } from "@/lib/types";

type Stats = {
  totalServices: number;
  activeServices: number;
  liveServices: number;
  pendingServices: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
  plan: "free" | "premium";
  subscriptionExpiresAt: string | null;
  activeLimit: number | null;
  recentBookings: Booking[];
};

export default function VendorOverview() {
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/vendor");

  return (
    <>
      <PageHeader
        title="Overview"
        description="How your business is doing on WedPlan."
        action={<Button asChild size="lg"><Link href="/dashboard/vendor/services/new"><Plus /> Add Service</Link></Button>}
      />
      {loading ? (
        <StatGridSkeleton count={5} />
      ) : error || !data ? (
        <ErrorState message={error ?? "Could not load your dashboard"} onRetry={() => reload()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Total services" value={data.totalServices} icon={Store} hint={`${data.pendingServices} awaiting approval`} />
            <StatCard
              label="Active services"
              value={data.activeServices}
              icon={Zap}
              tone="green"
              hint={data.activeLimit ? `${data.activeServices}/${data.activeLimit} on Free plan` : `${data.liveServices} live now`}
            />
            <StatCard label="Pending requests" value={data.pendingBookings} icon={CalendarClock} tone="gold" />
            <StatCard label="Accepted bookings" value={data.acceptedBookings} icon={CalendarCheck} tone="green" />
            <StatCard
              label="Current plan"
              value={<span className="capitalize">{data.plan}</span>}
              icon={Gem}
              tone={data.plan === "premium" ? "gold" : "slate"}
              hint={data.plan === "premium" && data.subscriptionExpiresAt ? `Renews ${formatDate(data.subscriptionExpiresAt)}` : "Up to 3 active services"}
            />
          </div>

          {data.plan === "free" ? (
            <Card className="mt-6 overflow-hidden border-0 bg-[oklch(0.27_0.04_158)] text-white">
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-heading text-2xl font-semibold">Grow with Premium</p>
                  <p className="text-sm text-white/75">Unlimited active services, a Premium vendor badge and Featured Partner placement.</p>
                </div>
                <Button asChild className="bg-[var(--gold)] text-[var(--gold-foreground)] hover:bg-[var(--gold)]/90">
                  <Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-sans text-lg">Latest booking requests</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard/vendor/bookings">Manage requests</Link></Button>
            </CardHeader>
            <CardContent>
              {data.recentBookings.length === 0 ? (
                <EmptyState icon={CalendarClock} title="No booking requests yet" description="Requests from customers will appear here." />
              ) : (
                <ul className="divide-y">
                  {data.recentBookings.map((b) => (
                    <li key={b._id} className="flex items-center gap-3 py-3">
                      <UserAvatar name={b.customer?.name} image={b.customer?.image} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{b.customer?.name ?? "Customer"}</p>
                        <p className="truncate text-sm text-muted-foreground">{b.service?.serviceName} · {formatEventDate(b.eventDate)}</p>
                      </div>
                      <StatusBadge status={b.status} />
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
