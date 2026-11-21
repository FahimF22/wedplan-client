import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { CATEGORIES, formatPrice } from "@/lib/constants";
import type { Service } from "@/lib/types";

export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  const cat = CATEGORIES.find((c) => c.value === service.category);
  const vendorName = service.vendor?.businessName || service.vendor?.name || "WedPlan vendor";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-xs transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={service.images[0]!}
          alt={service.serviceName}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <Badge className="absolute left-3 top-3 border-0 bg-background/90 text-foreground backdrop-blur">
          {cat ? <cat.icon className="size-3" /> : null}
          {cat?.short ?? service.category}
        </Badge>
        {service.vendor?.isPremium ? (
          <Badge className="absolute right-3 top-3 border-0 bg-[var(--gold)] text-[var(--gold-foreground)]">
            <BadgeCheck className="size-3" /> Featured Partner
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug">{service.serviceName}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5" /> {service.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <UserAvatar name={vendorName} image={service.vendor?.image} className="size-7 text-[11px]" />
          <span className="truncate text-sm">{vendorName}</span>
          {service.vendor?.isPremium ? <BadgeCheck className="size-4 shrink-0 text-[var(--gold)]" aria-label="Premium vendor" /> : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3">
          <p>
            <span className="text-xs text-muted-foreground">From </span>
            <span className="text-lg font-semibold text-primary">{formatPrice(service.price)}</span>
          </p>
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href={`/services/${service._id}`}>View Details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-7 w-1/2" />
        <div className="flex justify-between border-t pt-3">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
