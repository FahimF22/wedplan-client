"use client";

import { useState } from "react";
import { BadgeCheck, Check, CreditCard, Gem, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, ErrorState, PageHeader, StatusBadge } from "@/components/dashboard/widgets";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useApi } from "@/hooks/useApi";
import { api, errorMessage } from "@/lib/api";
import { formatDate, formatPrice, PREMIUM_PRICE } from "@/lib/constants";
import type { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

type Sub = { plan: "free" | "premium"; subscriptionExpiresAt: string | null; cancelAtPeriodEnd: boolean; price: number; currency: string };

const FREE = ["Maximum 3 active services", "Basic vendor dashboard", "Booking request management"];
const PREMIUM = ["Unlimited active services", "Premium vendor badge", "Featured Partner placement in search", "All Free plan features"];

export default function SubscriptionPage() {
  const sub = useApi<Sub>("/api/payments/subscription");
  const history = useApi<Transaction[]>("/api/payments/my");
  const [redirecting, setRedirecting] = useState(false);

  const upgrade = async () => {
    setRedirecting(true);
    try {
      const res = await api<{ url: string }>("/api/payments/checkout-session", { method: "POST" });
      toast.loading("Redirecting to secure Stripe checkout…");
      window.location.assign(res.data.url);
    } catch (err) {
      toast.error(errorMessage(err, "Could not start checkout"));
      setRedirecting(false);
    }
  };

  const setCancel = async (cancel: boolean) => {
    try {
      const res = await api(`/api/payments/${cancel ? "cancel" : "resume"}`, { method: "POST" });
      toast.success(res.message ?? "Subscription updated");
      sub.reload(true);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update your subscription"));
    }
  };

  const isPremium = sub.data?.plan === "premium";

  return (
    <>
      <PageHeader title="Subscription" description="Choose the plan that fits your business." />

      {sub.loading ? (
        <Skeleton className="mb-6 h-24 rounded-xl" />
      ) : sub.error || !sub.data ? (
        <ErrorState message={sub.error ?? "Could not load subscription"} onRetry={() => sub.reload()} />
      ) : (
        <Card className={cn("mb-6 py-5", isPremium && "border-[var(--gold)]/50 bg-[var(--gold)]/8")}>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className={cn("grid size-12 place-items-center rounded-xl", isPremium ? "bg-[var(--gold)] text-[var(--gold-foreground)]" : "bg-secondary text-primary")}>
                {isPremium ? <BadgeCheck className="size-6" /> : <Gem className="size-6" />}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current plan</p>
                <p className="text-xl font-semibold capitalize">{sub.data.plan}</p>
                {isPremium && sub.data.subscriptionExpiresAt ? (
                  <p className="text-sm text-muted-foreground">
                    {sub.data.cancelAtPeriodEnd ? "Ends" : "Renews"} on {formatDate(sub.data.subscriptionExpiresAt)}
                  </p>
                ) : null}
              </div>
            </div>
            {isPremium ? (
              sub.data.cancelAtPeriodEnd ? (
                <Button variant="outline" onClick={() => setCancel(false)}>Resume auto-renew</Button>
              ) : (
                <ConfirmDialog
                  destructive
                  title="Cancel Premium?"
                  description="You'll keep Premium until the end of the current billing period. After that your account returns to the Free plan (3 active services)."
                  confirmLabel="Cancel subscription"
                  onConfirm={() => setCancel(true)}
                  trigger={<Button variant="outline" className="text-destructive">Cancel subscription</Button>}
                />
              )
            ) : null}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className={cn(!isPremium && "ring-2 ring-primary/30")}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">Free</CardTitle>
              {!isPremium ? <Badge variant="secondary">Current plan</Badge> : null}
            </div>
            <CardDescription>For vendors getting started.</CardDescription>
            <p className="pt-2"><span className="font-heading text-5xl font-semibold">$0</span><span className="text-muted-foreground"> / month</span></p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {FREE.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 shrink-0 text-primary" /> {f}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-[var(--gold)]/60 bg-[oklch(0.27_0.04_158)] text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-[var(--gold)]/20 blur-2xl" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl">Premium</CardTitle>
              {isPremium ? <Badge className="bg-[var(--gold)] text-[var(--gold-foreground)]">Current plan</Badge> : <Badge className="bg-white/15">Most popular</Badge>}
            </div>
            <CardDescription className="text-white/70">For growing wedding businesses.</CardDescription>
            <p className="pt-2"><span className="font-heading text-5xl font-semibold">${PREMIUM_PRICE}</span><span className="text-white/70"> / month</span></p>
          </CardHeader>
          <CardContent className="relative">
            <ul className="space-y-3 text-sm">
              {PREMIUM.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 shrink-0 text-[var(--gold)]" /> {f}</li>)}
            </ul>
          </CardContent>
          <CardFooter className="relative flex-col items-stretch gap-2">
            {isPremium ? (
              <Button disabled className="h-11 bg-white/15 text-white">You&apos;re on Premium</Button>
            ) : (
              <Button onClick={upgrade} disabled={redirecting || sub.loading} className="h-11 bg-[var(--gold)] text-base text-[var(--gold-foreground)] hover:bg-[var(--gold)]/90">
                {redirecting ? <><Loader2 className="animate-spin" /> Processing payment…</> : <><CreditCard /> Upgrade to Premium</>}
              </Button>
            )}
            <p className="text-center text-xs text-white/60">Secure payment by Stripe (test mode). Cancel anytime.</p>
          </CardFooter>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 font-sans text-lg font-semibold">Your payment history</h2>
      {history.loading ? (
        <Skeleton className="h-32 rounded-xl" />
      ) : history.error ? (
        <ErrorState message={history.error} onRetry={() => history.reload()} />
      ) : !history.data?.length ? (
        <EmptyState icon={Receipt} title="No payments yet" description="Your Premium payments will be listed here." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="pl-4">Date</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="pr-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.data.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="pl-4">{formatDate(t.createdAt)}</TableCell>
                  <TableCell className="capitalize">{t.plan}</TableCell>
                  <TableCell>{formatPrice(t.amount, t.currency)}</TableCell>
                  <TableCell className="pr-4"><StatusBadge status={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
