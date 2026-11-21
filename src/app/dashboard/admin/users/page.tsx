"use client";

import { useState } from "react";
import { Ban, Eye, Search, ShieldCheck, UserCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageHeader, StatusBadge, TableSkeleton } from "@/components/dashboard/widgets";
import { Pager } from "@/components/dashboard/Pager";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { useApi } from "@/hooks/useApi";
import { useDebounced } from "@/hooks/useDebounced";
import { api, errorMessage } from "@/lib/api";
import { formatDate } from "@/lib/constants";
import type { PageMeta, Profile } from "@/lib/types";

type Details = Profile & { stats: { services: number; bookingsAsCustomer: number; bookingsAsVendor: number } };

export default function ManageUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const qs = new URLSearchParams({ page: String(page), limit: "10" });
  if (q.trim()) qs.set("search", q.trim());
  if (role !== "all") qs.set("role", role);
  if (status !== "all") qs.set("status", status);
  const { data, meta, loading, error, reload, setData } = useApi<Profile[], PageMeta>(`/api/admin/users?${qs}`);

  const [detailsId, setDetailsId] = useState<string | null>(null);
  const details = useApi<Details>(detailsId ? `/api/admin/users/${detailsId}` : null);

  const setBlocked = async (u: Profile, block: boolean) => {
    try {
      const res = await api<Profile>(`/api/admin/users/${u._id}/${block ? "block" : "unblock"}`, { method: "PATCH" });
      setData((list) => list?.map((x) => (x._id === u._id ? { ...x, isBlocked: block } : x)) ?? null);
      if (detailsId === u._id) details.reload(true);
      toast.success(res.message ?? (block ? "User blocked" : "User unblocked"));
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the user"));
    }
  };

  const blockButton = (u: Profile) =>
    u.role === "admin" ? (
      <Badge variant="secondary"><ShieldCheck className="size-3" /> Admin</Badge>
    ) : u.isBlocked ? (
      <ConfirmDialog
        title={`Unblock ${u.name}?`}
        description="They will be able to sign in and use the platform again."
        confirmLabel="Unblock"
        onConfirm={() => setBlocked(u, false)}
        trigger={<Button variant="outline" size="sm"><UserCheck /> Unblock</Button>}
      />
    ) : (
      <ConfirmDialog
        destructive
        title={`Block ${u.name}?`}
        description="They will be signed out immediately and won't be able to sign in or use dashboards, bookings or payments until unblocked."
        confirmLabel="Block user"
        onConfirm={() => setBlocked(u, true)}
        trigger={<Button variant="outline" size="sm" className="text-destructive"><Ban /> Block</Button>}
      />
    );

  return (
    <>
      <PageHeader title="Manage Users" description="View, search and moderate every registered account." />

      <Card className="mb-4 py-4">
        <CardContent className="grid gap-3 px-4 sm:grid-cols-[1fr_180px_180px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email" className="h-10 pl-9" />
          </div>
          <Select value={role} onValueChange={(v) => { setRole(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="customer">Customers</SelectItem>
              <SelectItem value="vendor">Vendors</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <TableSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !data?.length ? (
        <EmptyState icon={Users} title="No users found" description="Try a different name, email or filter." />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="pl-4">User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="pr-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="pl-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={u.name} image={u.image} />
                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate font-medium">{u.name}</p>
                          <p className="max-w-[220px] truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{u.role ?? "—"}</TableCell>
                    <TableCell>{u.role === "vendor" ? <span className="capitalize">{u.subscriptionPlan}</span> : "—"}</TableCell>
                    <TableCell><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(u.createdAt)}</TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setDetailsId(u._id)}><Eye /> View</Button>
                        {blockButton(u)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {data.map((u) => (
              <Card key={u._id} className="py-4">
                <CardContent className="space-y-3 px-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} image={u.image} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <StatusBadge status={u.isBlocked ? "blocked" : "active"} />
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-sm capitalize text-muted-foreground">{u.role ?? "no role"}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setDetailsId(u._id)}><Eye /> View</Button>
                      {blockButton(u)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {meta ? <Pager page={meta.page} totalPages={meta.totalPages} total={meta.total} onPage={setPage} /> : null}
        </>
      )}

      <Dialog open={!!detailsId} onOpenChange={(o) => !o && setDetailsId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-3xl">User details</DialogTitle>
            <DialogDescription>Account information and activity.</DialogDescription>
          </DialogHeader>
          {details.loading ? (
            <div className="space-y-3"><Skeleton className="h-16" /><Skeleton className="h-32" /></div>
          ) : details.error || !details.data ? (
            <ErrorState message={details.error ?? "Could not load user"} />
          ) : (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <UserAvatar name={details.data.name} image={details.data.image} className="size-14 text-lg" />
                <div>
                  <p className="text-base font-semibold">{details.data.name}</p>
                  <p className="text-muted-foreground">{details.data.email}</p>
                </div>
              </div>
              <dl className="grid grid-cols-[130px_1fr] gap-y-2">
                <dt className="text-muted-foreground">Role</dt><dd className="capitalize">{details.data.role ?? "—"}</dd>
                <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={details.data.isBlocked ? "blocked" : "active"} /></dd>
                {details.data.role === "vendor" ? (<>
                  <dt className="text-muted-foreground">Business</dt><dd>{details.data.businessName ?? "—"}</dd>
                  <dt className="text-muted-foreground">Plan</dt><dd className="capitalize">{details.data.subscriptionPlan}{details.data.subscriptionExpiresAt && details.data.subscriptionPlan === "premium" ? ` · until ${formatDate(details.data.subscriptionExpiresAt)}` : ""}</dd>
                  <dt className="text-muted-foreground">Services</dt><dd>{details.data.stats.services}</dd>
                  <dt className="text-muted-foreground">Requests received</dt><dd>{details.data.stats.bookingsAsVendor}</dd>
                </>) : null}
                {details.data.role === "customer" ? (<>
                  <dt className="text-muted-foreground">Requests sent</dt><dd>{details.data.stats.bookingsAsCustomer}</dd>
                </>) : null}
                <dt className="text-muted-foreground">Phone</dt><dd>{details.data.phone ?? "—"}</dd>
                <dt className="text-muted-foreground">Location</dt><dd>{details.data.location ?? "—"}</dd>
                <dt className="text-muted-foreground">Joined</dt><dd>{formatDate(details.data.createdAt)}</dd>
              </dl>
              {details.data.bio ? <p className="rounded-lg bg-muted p-3">{details.data.bio}</p> : null}
              <div className="flex justify-end">{blockButton(details.data)}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
