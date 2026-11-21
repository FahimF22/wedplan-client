"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, Mail, MapPin, Phone, SearchX, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Gallery } from "@/components/services/Gallery";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { EmptyState, ErrorState, StatusBadge } from "@/components/dashboard/widgets";
import { BookingPanel } from "./BookingPanel";
import { useApi } from "@/hooks/useApi";
import { useSession } from "@/lib/auth-client";
import { CATEGORIES, formatPrice } from "@/lib/constants";
import type { ServiceDetails as Details } from "@/lib/types";

export function ServiceDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const { data: s, loading, error, status, reload, setData } = useApi<Details>(`/api/services/${id}`);

  if (loading) {
    return (
      <div className="container-page grid gap-8 py-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-3">
          <Skeleton className="aspect-[16/10] rounded-2xl" />
          <div className="grid grid-cols-6 gap-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (status === 400 || status === 404) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={SearchX}
          title={status === 400 ? "Invalid service link" : "Service not found"}
          description={
            status === 400
              ? "The service ID in this link is not valid. Please check the URL or browse all services."
              : "This service doesn't exist, was removed, or is not currently available."
          }
          action={<Button asChild><Link href="/services">Browse services</Link></Button>}
        />
      </div>
    );
  }

  if (error || !s) {
    return (
      <div className="container-page py-16">
        <ErrorState message={error ?? "Could not load this service"} onRetry={() => reload()} />
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.value === s.category);
  const vendorName = s.vendor?.businessName || s.vendor?.name || "Vendor";

  return (
    <div className="container-page py-8">
      <Button asChild variant="ghost" className="mb-4 -ml-2">
        <Link href="/services"><ArrowLeft /> Back to services</Link>
      </Button>

      {!s.isPublic ? (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm">
          Preview only — this service is not visible to customers.
          <StatusBadge status={s.status} />
          {!s.isActive ? <StatusBadge status="inactive" /> : null}
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 space-y-8">
          <Gallery images={s.images} alt={s.serviceName} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{cat ? <cat.icon className="size-3" /> : null}{cat?.label ?? s.category}</Badge>
              {s.vendor?.isPremium ? (
                <Badge className="border-0 bg-[var(--gold)] text-[var(--gold-foreground)]"><BadgeCheck className="size-3" /> Featured Partner</Badge>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{s.serviceName}</h1>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {s.location}</span>
              <span className="flex items-center gap-1.5"><Tag className="size-4" /> Starting at <b className="text-foreground">{formatPrice(s.price)}</b></span>
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold">About this service</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground/85">{s.description}</p>
          </section>

          <Card>
            <CardContent>
              <h2 className="text-2xl font-semibold">About the vendor</h2>
              <div className="mt-4 flex items-start gap-4">
                <UserAvatar name={vendorName} image={s.vendor?.image} className="size-14 text-lg" />
                <div className="min-w-0 space-y-1">
                  <p className="flex items-center gap-1.5 font-semibold">
                    {vendorName}
                    {s.vendor?.isPremium ? <BadgeCheck className="size-4 text-[var(--gold)]" aria-label="Premium vendor" /> : null}
                  </p>
                  {s.vendor?.businessName && s.vendor?.name ? <p className="text-sm text-muted-foreground">Managed by {s.vendor.name}</p> : null}
                  {s.vendor?.location ? <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5" /> {s.vendor.location}</p> : null}
                  {s.vendor?.email ? <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Mail className="size-3.5" /> {s.vendor.email}</p> : null}
                  {s.vendor?.phone ? <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Phone className="size-3.5" /> {s.vendor.phone}</p> : null}
                  {s.vendor?.bio ? <p className="pt-2 text-sm leading-relaxed">{s.vendor.bio}</p> : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BookingPanel
            service={s}
            role={(session?.user as { role?: string } | undefined)?.role ?? null}
            onBooked={(booking) => setData((d) => (d ? { ...d, activeBooking: booking } : d))}
          />
        </aside>
      </div>
    </div>
  );
}
