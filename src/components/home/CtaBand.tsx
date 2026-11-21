import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/shared/Motion";

export function CtaBand() {
  return (
    <section className="container-page pb-20">
      <FadeUp className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-accent px-8 py-12 sm:px-12 md:flex-row md:items-center">
        <div>
          <h2 className="text-4xl font-semibold">Are you a wedding professional?</h2>
          <p className="mt-2 max-w-xl text-accent-foreground/80">
            List up to 3 services for free, manage booking requests from your dashboard, and go Premium for unlimited listings
            and a Featured Partner badge.
          </p>
        </div>
        <Button asChild size="lg" className="h-12 rounded-full px-7 text-base">
          <Link href="/signup">Join as a vendor</Link>
        </Button>
      </FadeUp>
    </section>
  );
}
