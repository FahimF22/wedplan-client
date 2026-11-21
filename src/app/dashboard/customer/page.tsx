"use client";

import Link from "next/link";
import { CalendarCheck, CalendarClock, CalendarX, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, ErrorState, PageHeader, StatCard, StatGridSkeleton, StatusBadge } from "@/components/dashboard/widgets";
import { useApi } from "@/hooks/useApi";
import { formatEventDate } from "@/lib/constants";
import type { Booking } from "@/lib/types";

type Stats = {
  totalBookings: number;
  pendingBookings: number;
  acceptedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;
  upcoming: Booking[];
};

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/customer");

  return (
    <>
      <PageHeader
        title="Overview"
        description="A quick look at your wedding booking requests."
        action={<Button asChild size="lg"><Link href="/services"><Search /> Find services</Link></Button>}
      />
      {loading ? (
        <StatGridSkeleton />
      ) : error || !data ? (
        <ErrorState message={error ?? "Could not load your dashboard"} onRetry={() => reload()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total booking requests" value={data.totalBookings} icon={ClipboardList} />
            <StatCard label="Pending" value={data.pendingBookings} icon={CalendarClock} tone="gold" />
            <StatCard label="Accepted" value={data.acceptedBookings} icon={CalendarCheck} tone="green" />
            <StatCard label="Rejected" value={data.rejectedBookings} icon={CalendarX} tone="rose" />
          </div>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-sans text-lg">Upcoming events</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/dashboard/customer/bookings">View all</Link></Button>
            </CardHeader>
            <CardContent>
              {data.upcoming.length === 0 ? (
                <EmptyState icon={CalendarClock} title="No upcoming bookings" description="When you request a service, it will show up here." />
              ) : (
                <ul className="divide-y">
                  {data.upcoming.map((b) => (
                    <li key={b._id} className="flex items-center gap-3 py-3">
                      {b.service?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.service.images[0]} alt="" className="size-12 rounded-lg object-cover" />
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{b.service?.serviceName ?? "Service removed"}</p>
                        <p className="text-sm text-muted-foreground">{formatEventDate(b.eventDate)} · {b.eventLocation}</p>
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
