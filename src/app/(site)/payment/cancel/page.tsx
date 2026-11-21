import type { Metadata } from "next";
import Link from "next/link";
import { CircleX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Payment cancelled" };

export default async function PaymentCancelPage() {
  await requireUser({ redirectTo: "/payment/cancel" });
  return (
    <section className="container-page flex flex-1 items-center justify-center py-16">
      <div className="mx-auto w-full max-w-lg rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-muted">
          <CircleX className="size-9 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-semibold">Payment cancelled</h1>
        <p className="mt-3 text-muted-foreground">
          You left Stripe checkout before completing the payment. Nothing was charged and your plan has not changed. You can
          upgrade whenever you&apos;re ready.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg"><Link href="/dashboard/vendor/subscription">Try again</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/dashboard">Go to dashboard</Link></Button>
        </div>
      </div>
    </section>
  );
}
