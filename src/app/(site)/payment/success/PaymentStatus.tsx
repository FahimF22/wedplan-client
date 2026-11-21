"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { AlertTriangle, BadgeCheck, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/constants";

type SessionInfo = {
  status: "pending" | "completed" | "failed" | "expired";
  amount: number;
  currency: string;
  plan: string;
  isPremium: boolean;
  subscriptionExpiresAt: string | null;
};

const MAX_ATTEMPTS = 20; // ~40 seconds

/**
 * Premium is activated ONLY by the verified Stripe webhook on the server.
 * This page just polls the server until the webhook has recorded the payment.
 */
export function PaymentStatus() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const [state, setState] = useState<"verifying" | "done" | "slow" | "error">(sessionId ? "verifying" : "error");
  const [message, setMessage] = useState<string>(sessionId ? "" : "Missing payment session. Please start the upgrade from your Subscription page.");
  const attempts = useRef(0);

  useEffect(() => {
    if (!sessionId) return;
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      attempts.current += 1;
      try {
        const res = await api<SessionInfo>(`/api/payments/session/${encodeURIComponent(sessionId)}`);
        if (stop) return;
        setInfo(res.data);
        if (res.data.status === "completed" && res.data.isPremium) {
          setState("done");
          return;
        }
        if (res.data.status === "failed" || res.data.status === "expired") {
          setState("error");
          setMessage(`This payment ${res.data.status === "failed" ? "failed" : "expired"}. You have not been charged for Premium.`);
          return;
        }
      } catch (err) {
        if (stop) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 403)) {
          setState("error");
          setMessage("We couldn't find this payment for your account.");
          return;
        }
      }
      if (attempts.current >= MAX_ATTEMPTS) {
        setState("slow");
        return;
      }
      timer = setTimeout(poll, 2000);
    };
    poll();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [sessionId]);

  if (state === "verifying") {
    return (
      <Shell icon={<Loader2 className="size-9 animate-spin text-primary" />} title="Verifying your Stripe payment…">
        <p className="text-muted-foreground">Hang tight — we&apos;re waiting for Stripe to confirm your payment. This usually takes a few seconds.</p>
      </Shell>
    );
  }

  if (state === "done" && info) {
    return (
      <Shell
        icon={
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <BadgeCheck className="size-10 text-[var(--gold)]" />
          </motion.div>
        }
        title="Welcome to Premium!"
      >
        <p className="text-muted-foreground">Your payment was verified by Stripe and your account has been upgraded.</p>
        <dl className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-y-2 rounded-xl bg-muted p-4 text-left text-sm">
          <dt className="text-muted-foreground">Plan</dt><dd className="text-right font-medium capitalize">{info.plan} · monthly</dd>
          <dt className="text-muted-foreground">Amount</dt><dd className="text-right font-medium">{formatPrice(info.amount, info.currency)}</dd>
          <dt className="text-muted-foreground">Renews</dt><dd className="text-right font-medium">{formatDate(info.subscriptionExpiresAt)}</dd>
        </dl>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link href="/dashboard/vendor/services/new">Add a service</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/dashboard/vendor/subscription">View subscription</Link></Button>
        </div>
      </Shell>
    );
  }

  if (state === "slow") {
    return (
      <Shell icon={<Clock className="size-9 text-warning" />} title="Still confirming your payment">
        <p className="text-muted-foreground">
          Stripe hasn&apos;t confirmed the payment yet. Premium will be activated automatically as soon as it does — check your
          Subscription page in a minute.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg"><Link href="/dashboard/vendor/subscription">Go to Subscription</Link></Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell icon={<AlertTriangle className="size-9 text-destructive" />} title="We couldn't confirm this payment">
      <p className="text-muted-foreground">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg"><Link href="/dashboard/vendor/subscription">Back to Subscription</Link></Button>
      </div>
    </Shell>
  );
}

function Shell({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
      <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-secondary">{icon}</div>
      <h1 className="text-4xl font-semibold">{title}</h1>
      <div className="mt-3">{children}</div>
    </div>
  );
}
