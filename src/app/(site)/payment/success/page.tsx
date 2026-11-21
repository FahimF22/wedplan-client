import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { requireUser } from "@/lib/session";
import { PaymentStatus } from "./PaymentStatus";

export const metadata: Metadata = { title: "Payment successful" };

export default async function PaymentSuccessPage() {
  await requireUser({ redirectTo: "/payment/success" });
  return (
    <section className="container-page flex flex-1 items-center justify-center py-16">
      <Suspense fallback={<Loader2 className="size-8 animate-spin text-primary" />}>
        <PaymentStatus />
      </Suspense>
    </section>
  );
}
