import type { Metadata } from "next";
import Link from "next/link";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Account blocked" };

export default function BlockedPage() {
  return (
    <section className="container-page flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-destructive/10 text-destructive">
        <ShieldOff className="size-8" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold">Your account has been blocked</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        An administrator has restricted access to this account, so dashboards, bookings and payments are unavailable. If you
        think this is a mistake, contact us at{" "}
        <a href="mailto:hello@wedplan.app" className="font-medium text-primary underline">
          hello@wedplan.app
        </a>
        .
      </p>
      <Button asChild className="mt-8" size="lg">
        <Link href="/">Back to home</Link>
      </Button>
    </section>
  );
}
