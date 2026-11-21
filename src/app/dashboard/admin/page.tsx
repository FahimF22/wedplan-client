"use client";

import Link from "next/link";
import { BadgeDollarSign, ClipboardCheck, Gem, Receipt, Store, UserRound, Users, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState, PageHeader, StatCard, StatGridSkeleton } from "@/components/dashboard/widgets";
import { useApi } from "@/hooks/useApi";
import { formatPrice } from "@/lib/constants";

type Stats = {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalAdmins: number;
  blockedUsers: number;
  totalServices: number;
  pendingServices: number;
  liveServices: number;
  totalTransactions: number;
  revenue: number;
  totalBookings: number;
  premiumVendors: number;
};

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi<Stats>("/api/stats/admin");

  return (
    <>
      <PageHeader title="Admin overview" description="Platform health at a glance." />
      {loading ? (
        <StatGridSkeleton count={8} />
      ) : error || !data ? (
        <ErrorState message={error ?? "Could not load stats"} onRetry={() => reload()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total registered users" value={data.totalUsers} icon={Users} hint={`${data.blockedUsers} blocked`} />
            <StatCard label="Total vendors" value={data.totalVendors} icon={Store} tone="gold" hint={`${data.premiumVendors} premium`} />
            <StatCard label="Total customers" value={data.totalCustomers} icon={UserRound} tone="slate" />
            <StatCard label="Total services" value={data.totalServices} icon={ClipboardCheck} tone="green" hint={`${data.liveServices} live`} />
            <StatCard label="Pending services" value={data.pendingServices} icon={UsersRound} tone="rose" hint="Awaiting review" />
            <StatCard label="Total transactions" value={data.totalTransactions} icon={Receipt} tone="slate" />
            <StatCard label="Verified subscription revenue" value={formatPrice(data.revenue)} icon={BadgeDollarSign} tone="green" hint="Completed Stripe payments" />
            <StatCard label="Booking requests" value={data.totalBookings} icon={Gem} tone="gold" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-sans text-lg">Quick moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {data.pendingServices > 0
                    ? `${data.pendingServices} service${data.pendingServices > 1 ? "s are" : " is"} waiting for your review.`
                    : "No services are waiting for review right now."}
                </p>
                <Button asChild>
                  <Link href="/dashboard/admin/services?status=pending">Review pending services ({data.pendingServices})</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-sans text-lg">People</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Search members, review details and block accounts that break the rules.</p>
                <Button asChild variant="outline">
                  <Link href="/dashboard/admin/users">Manage users</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
