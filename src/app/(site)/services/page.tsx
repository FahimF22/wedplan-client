import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceCardSkeleton } from "@/components/services/ServiceCard";
import { BrowseServices } from "./BrowseServices";

export const metadata: Metadata = {
  title: "Browse Wedding Services",
  description: "Search approved wedding photographers, venues, decorators, caterers, makeup artists and designers.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b bg-secondary/60">
        <div className="container-page py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[oklch(0.58_0.11_75)]">Browse</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Find your wedding team</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Every service here has been approved by our team. Search by name, filter by category or city, and sort by price.
          </p>
        </div>
      </section>
      <div className="container-page py-8">
        <Suspense
          fallback={
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
            </div>
          }
        >
          <BrowseServices />
        </Suspense>
      </div>
    </>
  );
}
