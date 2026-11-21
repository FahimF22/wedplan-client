"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, Gem, Pencil, Plus, Store, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useApi } from "@/hooks/useApi";
import { api, errorMessage } from "@/lib/api";
import { categoryLabel, formatPrice } from "@/lib/constants";
import type { Service } from "@/lib/types";

type Meta = { activeCount: number; limit: number | null; isPremium: boolean };

export default function MyServicesPage() {
  const { data, meta, loading, error, reload, setData } = useApi<Service[], Meta>("/api/vendor/services");
  const [toggling, setToggling] = useState<string | null>(null);

  const toggle = async (s: Service, isActive: boolean) => {
    setToggling(s._id);
    try {
      const res = await api<Service>(`/api/vendor/services/${s._id}/availability`, { method: "PATCH", body: { isActive } });
      setData((list) => list?.map((x) => (x._id === s._id ? { ...x, isActive } : x)) ?? null);
      toast.success(res.message ?? "Availability updated");
      reload(true);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update availability"));
    } finally {
      setToggling(null);
    }
  };

  const remove = async (s: Service) => {
    try {
      await api(`/api/vendor/services/${s._id}`, { method: "DELETE" });
      setData((list) => list?.filter((x) => x._id !== s._id) ?? null);
      toast.success(`"${s.serviceName}" was deleted`);
      reload(true);
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete the service"));
    }
  };

  const actions = (s: Service) => (
    <div className="flex items-center justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon-sm" aria-label="View">
            <Link href={`/services/${s._id}`}><Eye /></Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>View</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild variant="ghost" size="icon-sm" aria-label="Edit">
            <Link href={`/dashboard/vendor/services/${s._id}/edit`}><Pencil /></Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Edit</TooltipContent>
      </Tooltip>
      <ConfirmDialog
        destructive
        title="Delete this service?"
        description={<>“{s.serviceName}” will be permanently removed and any pending booking requests for it will be cancelled.</>}
        confirmLabel="Delete"
        onConfirm={() => remove(s)}
        trigger={
          <Button variant="ghost" size="icon-sm" aria-label="Delete" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
            <Trash2 />
          </Button>
        }
      />
    </div>
  );

  const availability = (s: Service) => (
    <div className="flex items-center gap-2">
      <Switch
        checked={s.isActive}
        disabled={toggling === s._id || s.status === "rejected"}
        onCheckedChange={(v) => toggle(s, v)}
        aria-label="Toggle availability"
      />
      <span className="text-xs text-muted-foreground">{s.isActive ? "Available" : "Paused"}</span>
    </div>
  );

  return (
    <>
      <PageHeader
        title="My Services"
        description="Manage your listings, availability and approval status."
        action={
          <Button asChild size="lg">
            <Link href="/dashboard/vendor/services/new"><Plus /> Add Service</Link>
          </Button>
        }
      />

      {meta && !meta.isPremium ? (
        <Card className="mb-6 border-[var(--gold)]/40 bg-[var(--gold)]/8 py-4">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Gem className="size-5 text-[var(--gold)]" />
              <p className="text-sm">
                <b>{meta.activeCount}</b> of <b>{meta.limit}</b> active services used on the Free plan.
                {meta.activeCount >= (meta.limit ?? 3) ? " Pause a service or upgrade to add more." : ""}
              </p>
            </div>
            <Button asChild size="sm" variant="outline"><Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link></Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState
          icon={Store}
          title="No services yet"
          description="Add your first service — once approved by an admin it will appear on the Browse page."
          action={<Button asChild><Link href="/dashboard/vendor/services/new"><Plus /> Add your first service</Link></Button>}
        />
      ) : (
        <>
          {/* desktop table */}
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-4">Service</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.images[0]} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="max-w-[260px] truncate font-medium">{s.serviceName}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabel(s.category)} · {s.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(s.price)}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell>{availability(s)}</TableCell>
                    <TableCell className="pr-4">{actions(s)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* mobile cards */}
          <div className="grid gap-3 md:hidden">
            {data.map((s) => (
              <Card key={s._id} className="gap-3 py-4">
                <CardContent className="space-y-3 px-4">
                  <div className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.images[0]} alt="" className="size-16 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{s.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{categoryLabel(s.category)}</p>
                      <p className="mt-1 text-sm font-semibold">{formatPrice(s.price)}</p>
                    </div>
                    <StatusBadge status={s.status} className="h-fit" />
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    {availability(s)}
                    {actions(s)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Only <b>approved</b> and <b>available</b> services are shown to customers. Rejected services stay hidden.
          </p>
        </>
      )}
    </>
  );
}
