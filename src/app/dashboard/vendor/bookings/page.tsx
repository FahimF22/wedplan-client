"use client";

import { useState } from "react";
import { CalendarDays, Check, Inbox, Loader2, Mail, MapPin, MessageSquareText, Phone, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { api, errorMessage } from "@/lib/api";
import { formatDate, formatEventDate, formatPrice } from "@/lib/constants";
import type { Booking } from "@/lib/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

export default function VendorBookingsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const { data, loading, error, reload, setData } = useApi<Booking[]>(
    `/api/vendor/bookings${filter === "all" ? "" : `?status=${filter}`}`,
  );
  const [busy, setBusy] = useState<string | null>(null);

  const act = async (b: Booking, action: "accept" | "reject") => {
    setBusy(b._id + action);
    try {
      await api(`/api/vendor/bookings/${b._id}`, { method: "PATCH", body: { action } });
      const status = action === "accept" ? "accepted" : "rejected";
      setData((list) =>
        (filter === "pending" ? list?.filter((x) => x._id !== b._id) : list?.map((x) => (x._id === b._id ? { ...x, status } : x))) ?? null,
      );
      toast.success(action === "accept" ? "Booking accepted — the customer can see it now" : "Booking request rejected");
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the booking"));
      reload(true);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader title="Booking Requests" description="Review requests from customers. Each request can be accepted or rejected once." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">{f}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState icon={Inbox} title={filter === "pending" ? "You're all caught up" : `No ${filter === "all" ? "" : filter} requests`} description="New booking requests for your services will appear here." />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.map((b) => (
            <Card key={b._id} className="py-5">
              <CardContent className="space-y-4 px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar name={b.customer?.name} image={b.customer?.image} className="size-11" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{b.customer?.name ?? "Customer"}</p>
                      <p className="flex items-center gap-1 truncate text-xs text-muted-foreground"><Mail className="size-3" /> {b.customer?.email}</p>
                      {b.customer?.phone ? <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="size-3" /> {b.customer.phone}</p> : null}
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-muted p-3">
                  {b.service?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.service.images[0]} alt="" className="size-12 rounded-lg object-cover" />
                  ) : null}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.service?.serviceName ?? "Service removed"}</p>
                    {b.service ? <p className="text-xs text-muted-foreground">{formatPrice(b.service.price)}</p> : null}
                  </div>
                </div>

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /> {formatEventDate(b.eventDate)}</p>
                  <p className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> <span className="truncate">{b.eventLocation}</span></p>
                </div>
                {b.message ? (
                  <p className="flex gap-2 rounded-lg border bg-background p-3 text-sm">
                    <MessageSquareText className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="whitespace-pre-line">{b.message}</span>
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <span className="text-xs text-muted-foreground">Requested {formatDate(b.createdAt)}</span>
                  {b.status === "pending" ? (
                    <div className="flex gap-2">
                      <ConfirmDialog
                        destructive
                        title="Reject this request?"
                        description="The customer will see the request as rejected. This cannot be changed later."
                        confirmLabel="Reject"
                        onConfirm={() => act(b, "reject")}
                        trigger={
                          <Button variant="outline" size="sm" disabled={!!busy} className="text-destructive">
                            {busy === b._id + "reject" ? <Loader2 className="animate-spin" /> : <X />} Reject
                          </Button>
                        }
                      />
                      <Button size="sm" disabled={!!busy} onClick={() => act(b, "accept")}>
                        {busy === b._id + "accept" ? <Loader2 className="animate-spin" /> : <Check />} Accept
                      </Button>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
