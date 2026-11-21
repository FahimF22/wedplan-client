import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Stagger, StaggerItem } from "@/components/shared/Motion";
import { publicGet } from "@/lib/server-api";
import type { Service } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";

export async function FeaturedServices() {
  const services = await publicGet<Service[]>("/api/services/featured?limit=8");

  return (
    <section className="container-page py-20">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          className="mb-0"
          eyebrow="Featured"
          title="Featured wedding services"
          description="Hand-picked, admin-approved services from our vendors — Premium partners shown first."
        />
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/services">
            View all services <ArrowRight />
          </Link>
        </Button>
      </div>

      {services && services.length > 0 ? (
        <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s, i) => (
            <StaggerItem key={s._id}>
              <ServiceCard service={s} priority={i < 2} />
            </StaggerItem>
          ))}
        </Stagger>
      ) : (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-14 text-center">
          <Store className="size-8 text-muted-foreground" />
          <p className="mt-3 font-medium">{services ? "No services have been approved yet." : "We couldn't load services right now."}</p>
          <p className="text-sm text-muted-foreground">Please check back soon.</p>
        </div>
      )}
    </section>
  );
}
