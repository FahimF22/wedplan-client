"use client";

import Link from "next/link";
import { useState } from "react";
import { Ban, CalendarDays, Eye, ListChecks, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { api, errorMessage } from "@/lib/api";
import { categoryLabel, formatDate, formatEventDate, formatPrice } from "@/lib/constants";
import type { Booking } from "@/lib/types";

const FILTERS = ["all", "pending", "accepted", "rejected", "cancelled"] as const;

export default function MyBookingsPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const { data, loading, error, reload, setData } = useApi<Booking[]>(
    `/api/customer/bookings${filter === "all" ? "" : `?status=${filter}`}`,
  );
  const [viewing, setViewing] = useState<Booking | null>(null);

  const cancel = async (b: Booking) => {
    try {
      await api(`/api/customer/bookings/${b._id}/cancel`, { method: "PATCH" });
      setData((list) => list?.map((x) => (x._id === b._id ? { ...x, status: "cancelled" } : x)) ?? null);
      toast.success("Booking request cancelled");
    } catch (err) {
      toast.error(errorMessage(err, "Could not cancel the booking"));
      reload(true);
    }
  };

  const vendorName = (b: Booking) => b.vendor?.businessName || b.vendor?.name || "Vendor";

  const actions = (b: Booking) => (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="sm" onClick={() => setViewing(b)}><Eye /> Details</Button>
      {b.status === "pending" ? (
        <ConfirmDialog
          destructive
          title="Cancel this booking request?"
          description={<>Your request for “{b.service?.serviceName}” on {formatEventDate(b.eventDate)} will be withdrawn. This can’t be undone.</>}
          confirmLabel="Cancel request"
          onConfirm={() => cancel(b)}
          trigger={<Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive"><Ban /> Cancel</Button>}
        />
      ) : null}
    </div>
  );

  return (
    <>
      <PageHeader title="My Bookings" description="Track and manage every booking request you've sent." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
        <TabsList className="h-auto flex-wrap">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f} className="capitalize">{f}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState
          icon={ListChecks}
          title={filter === "all" ? "No booking requests yet" : `No ${filter} bookings`}
          description="Browse services and send a request to a vendor you love."
          action={<Button asChild><Link href="/services">Browse services</Link></Button>}
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-4">Service</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        {b.service?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={b.service.images[0]} alt="" className="size-11 rounded-lg object-cover" />
                        ) : <div className="size-11 rounded-lg bg-muted" />}
                        <span className="max-w-[200px] truncate font-medium">{b.service?.serviceName ?? "Service removed"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserAvatar name={vendorName(b)} image={b.vendor?.image} className="size-7 text-[10px]" />
                        <span className="max-w-[140px] truncate">{vendorName(b)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatEventDate(b.eventDate)}</p>
                      <p className="max-w-[180px] truncate text-xs text-muted-foreground">{b.eventLocation}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(b.createdAt)}</TableCell>
                    <TableCell><StatusBadge status={b.status} /></TableCell>
                    <TableCell className="pr-4">{actions(b)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 lg:hidden">
            {data.map((b) => (
              <Card key={b._id} className="py-4">
                <CardContent className="space-y-3 px-4">
                  <div className="flex gap-3">
                    {b.service?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.service.images[0]} alt="" className="size-16 rounded-lg object-cover" />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{b.service?.serviceName ?? "Service removed"}</p>
                      <p className="truncate text-sm text-muted-foreground">{vendorName(b)}</p>
                      <StatusBadge status={b.status} className="mt-1" />
                    </div>
                  </div>
                  <div className="grid gap-1 text-sm">
                    <p className="flex items-center gap-2"><CalendarDays className="size-4 text-muted-foreground" /> {formatEventDate(b.eventDate)}</p>
                    <p className="flex items-center gap-2"><MapPin className="size-4 text-muted-foreground" /> {b.eventLocation}</p>
                    <p className="text-xs text-muted-foreground">Requested {formatDate(b.createdAt)}</p>
                  </div>
                  <div className="border-t pt-2">{actions(b)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          {viewing ? (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-3xl">Booking details</DialogTitle>
                <DialogDescription>Requested on {formatDate(viewing.createdAt)}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div className="flex gap-3 rounded-xl bg-muted p-3">
                  {viewing.service?.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewing.service.images[0]} alt="" className="size-16 rounded-lg object-cover" />
                  ) : null}
                  <div>
                    <p className="font-semibold">{viewing.service?.serviceName ?? "Service removed"}</p>
                    <p className="text-muted-foreground">{categoryLabel(viewing.service?.category)}</p>
                    {viewing.service ? <p className="font-medium text-primary">{formatPrice(viewing.service.price)}</p> : null}
                  </div>
                </div>
                <dl className="grid grid-cols-[120px_1fr] gap-y-2">
                  <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={viewing.status} /></dd>
                  <dt className="text-muted-foreground">Event date</dt><dd className="font-medium">{formatEventDate(viewing.eventDate)}</dd>
                  <dt className="text-muted-foreground">Location</dt><dd>{viewing.eventLocation}</dd>
                  <dt className="text-muted-foreground">Vendor</dt><dd>{vendorName(viewing)}{viewing.vendor?.email ? <span className="block text-muted-foreground">{viewing.vendor.email}</span> : null}</dd>
                  <dt className="text-muted-foreground">Your message</dt><dd className="whitespace-pre-line">{viewing.message || "—"}</dd>
                </dl>
                {viewing.service ? (
                  <Button asChild variant="outline" className="w-full"><Link href={`/services/${viewing.serviceId}`}>View service</Link></Button>
                ) : null}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
