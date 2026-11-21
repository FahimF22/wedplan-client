"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Check, Eye, MoreHorizontal, Pause, Play, RotateCcw, Search, Store, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { Pager } from "@/components/dashboard/Pager";
import { useApi } from "@/hooks/useApi";
import { useDebounced } from "@/hooks/useDebounced";
import { api, errorMessage } from "@/lib/api";
import { CATEGORIES, categoryLabel, formatDate, formatPrice } from "@/lib/constants";
import type { PageMeta, Service } from "@/lib/types";

export function ManageServices() {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(params.get("status") ?? "all");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const qs = new URLSearchParams({ page: String(page), limit: "10" });
  if (q.trim()) qs.set("search", q.trim());
  if (status !== "all") qs.set("status", status);
  if (category !== "all") qs.set("category", category);
  const { data, meta, loading, error, reload, setData } = useApi<Service[], PageMeta>(`/api/admin/services?${qs}`);

  const moderate = async (s: Service, body: { status?: string; isActive?: boolean }) => {
    try {
      const res = await api<Service>(`/api/admin/services/${s._id}/status`, { method: "PATCH", body });
      setData((list) => list?.map((x) => (x._id === s._id ? { ...x, ...body } as Service : x)) ?? null);
      toast.success(res.message ?? "Service status updated");
      if (status !== "all" && body.status && body.status !== status) reload(true);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the service"));
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api(`/api/admin/services/${toDelete._id}`, { method: "DELETE" });
      setData((list) => list?.filter((x) => x._id !== toDelete._id) ?? null);
      toast.success("Service deleted");
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete the service"));
    } finally {
      setDeleting(false);
    }
  };

  const menu = (s: Service) => (
    <div className="flex justify-end gap-1">
      {s.status === "pending" ? (
        <>
          <Button size="sm" onClick={() => moderate(s, { status: "approved" })}><Check /> Approve</Button>
          <Button size="sm" variant="outline" className="text-destructive" onClick={() => moderate(s, { status: "rejected" })}><X /> Reject</Button>
        </>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions"><MoreHorizontal /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem asChild><Link href={`/services/${s._id}`}><Eye /> Preview</Link></DropdownMenuItem>
          <DropdownMenuSeparator />
          {s.status !== "approved" ? <DropdownMenuItem onSelect={() => moderate(s, { status: "approved" })}><Check /> Approve</DropdownMenuItem> : null}
          {s.status !== "rejected" ? <DropdownMenuItem onSelect={() => moderate(s, { status: "rejected" })}><X /> Reject</DropdownMenuItem> : null}
          {s.status !== "pending" ? <DropdownMenuItem onSelect={() => moderate(s, { status: "pending" })}><RotateCcw /> Move back to pending</DropdownMenuItem> : null}
          {s.isActive ? (
            <DropdownMenuItem onSelect={() => moderate(s, { isActive: false })}><Pause /> Deactivate</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onSelect={() => moderate(s, { isActive: true })}><Play /> Activate</DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setToDelete(s)}><Trash2 /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <>
      <PageHeader title="Manage Services" description="Review submissions and keep the marketplace trustworthy." />

      <Card className="mb-4 py-4">
        <CardContent className="grid gap-3 px-4 sm:grid-cols-[1fr_170px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search service, vendor or location" className="h-10 pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState icon={Store} title="No services found" description="Nothing matches these filters." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-4">Service</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((s) => (
                  <TableRow key={s._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.images[0]} alt="" className="size-11 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-medium">{s.serviceName}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabel(s.category)} · {s.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[160px] truncate">{s.vendor?.businessName || s.vendor?.name}</p>
                      <p className="max-w-[160px] truncate text-xs text-muted-foreground">{s.vendor?.email}</p>
                    </TableCell>
                    <TableCell>{formatPrice(s.price)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={s.status} />
                        {!s.isActive ? <StatusBadge status="inactive" /> : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                    <TableCell className="pr-4">{menu(s)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 lg:hidden">
            {data.map((s) => (
              <Card key={s._id} className="py-4">
                <CardContent className="space-y-3 px-4">
                  <div className="flex gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.images[0]} alt="" className="size-16 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{s.serviceName}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.vendor?.businessName || s.vendor?.name}</p>
                      <div className="mt-1 flex gap-1"><StatusBadge status={s.status} />{!s.isActive ? <StatusBadge status="inactive" /> : null}</div>
                    </div>
                  </div>
                  <div className="border-t pt-3">{menu(s)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} /> : null}
        </>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-sans">Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.serviceName}” will be permanently removed and its pending booking requests cancelled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "destructive" })} disabled={deleting} onClick={(e) => { e.preventDefault(); confirmDelete(); }}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
