"use client";

import { useState } from "react";
import { BadgeDollarSign, Lock, Receipt, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, ErrorState, PageHeader, StatCard, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { Pager } from "@/components/dashboard/Pager";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { useDebounced } from "@/hooks/useDebounced";
import { formatPrice } from "@/lib/constants";
import type { PageMeta, Transaction } from "@/lib/types";

const dateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function TransactionsPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const qs = new URLSearchParams({ page: String(page), limit: "10" });
  if (status !== "all") qs.set("status", status);
  if (q.trim()) qs.set("search", q.trim());
  const { data, meta, loading, error, reload } = useApi<Transaction[], PageMeta & { revenue: number }>(`/api/admin/transactions?${qs}`);

  return (
    <>
      <PageHeader title="Transactions" description="Premium subscription payments recorded from verified Stripe events." />

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <StatCard label="Verified subscription revenue" value={formatPrice(meta?.revenue ?? 0)} icon={BadgeDollarSign} tone="green" hint="Sum of completed payments" />
        <Card className="py-0">
          <CardContent className="flex h-full items-center gap-3 p-5 text-sm text-muted-foreground">
            <Lock className="size-5 shrink-0 text-primary" />
            Payment records are read-only. Statuses change only through signature-verified Stripe webhooks — they can’t be edited by hand.
          </CardContent>
        </Card>
      </div>

      <Card className="mb-4 py-4">
        <CardContent className="grid gap-3 px-4 sm:grid-cols-[1fr_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search vendor name or email" className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState icon={Receipt} title="No transactions yet" description="When vendors upgrade to Premium, their payments will appear here." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-4">Vendor</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={t.vendor?.name} image={t.vendor?.image} />
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-medium">{t.vendor?.businessName || t.vendor?.name || "Deleted vendor"}</p>
                          <p className="max-w-[220px] truncate text-xs text-muted-foreground">{t.vendor?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{t.plan} · monthly</TableCell>
                    <TableCell className="font-medium">{formatPrice(t.amount, t.currency)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="pr-4 text-muted-foreground">{dateTime(t.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {data.map((t) => (
              <Card key={t._id} className="py-4">
                <CardContent className="flex items-center gap-3 px-4">
                  <UserAvatar name={t.vendor?.name} image={t.vendor?.image} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{t.vendor?.businessName || t.vendor?.name}</p>
                    <p className="text-xs text-muted-foreground">{dateTime(t.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(t.amount, t.currency)}</p>
                    <StatusBadge status={t.status} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} /> : null}
        </>
      )}
    </>
  );
}
