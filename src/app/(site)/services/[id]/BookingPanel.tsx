"use client";

import Link from "next/link";
import { CalendarHeart, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/constants";
import type { Booking, ServiceDetails } from "@/lib/types";

/** Booking card — the actual booking form is added in the next step. */
export function BookingPanel({
  service,
  role,
}: {
  service: ServiceDetails;
  role: string | null;
  onBooked: (b: Booking) => void;
}) {
  const note = (text: string, action?: React.ReactNode) => (
    <div className="space-y-3 rounded-xl bg-muted p-4 text-sm">
      <p className="flex gap-2"><Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {text}</p>
      {action}
    </div>
  );

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="font-heading text-4xl font-semibold text-primary">{formatPrice(service.price)}</p>
        </div>
        {service.isOwner
          ? note("This is your own service — vendors cannot book their own services.", (
              <Button asChild variant="outline" size="sm"><Link href={`/dashboard/vendor/services/${service._id}/edit`}><Pencil /> Edit service</Link></Button>
            ))
          : role === "admin"
            ? note("Admin accounts cannot submit customer booking requests.")
            : role === "vendor"
              ? note("You're signed in as a vendor. Create a customer account to book services.")
              : (
                <Button size="lg" className="h-12 w-full text-base" disabled>
                  <CalendarHeart /> Request booking
                </Button>
              )}
      </CardContent>
    </Card>
  );
}
