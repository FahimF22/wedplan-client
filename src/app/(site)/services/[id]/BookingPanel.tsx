"use client";

import Link from "next/link";
import { CheckCircle2, Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/dashboard/widgets";
import { BookingDialog } from "./BookingDialog";
import { formatEventDate, formatPrice } from "@/lib/constants";
import type { Booking, ServiceDetails } from "@/lib/types";

export function BookingPanel({
  service,
  role,
  onBooked,
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

  let body: React.ReactNode;
  if (service.isOwner) {
    body = note("This is your own service — vendors cannot book their own services.", (
      <Button asChild variant="outline" size="sm"><Link href={`/dashboard/vendor/services/${service._id}/edit`}><Pencil /> Edit service</Link></Button>
    ));
  } else if (role === "admin") {
    body = note("Admin accounts cannot submit customer booking requests.");
  } else if (role === "vendor") {
    body = note("You're signed in as a vendor. Only customer accounts can send booking requests.");
  } else if (!service.isPublic) {
    body = note("This service is not currently available for booking.");
  } else if (service.activeBooking) {
    const b = service.activeBooking;
    body = (
      <div className="space-y-4 rounded-xl border border-success/30 bg-success/8 p-4">
        <p className="flex items-center gap-2 font-semibold text-success"><CheckCircle2 className="size-5" /> Booking request submitted</p>
        <div className="space-y-1 text-sm">
          <p className="flex items-center justify-between">Status <StatusBadge status={b.status} /></p>
          <p className="flex items-center justify-between">Event date <b>{formatEventDate(b.eventDate)}</b></p>
          <p className="flex items-center justify-between gap-4">Location <b className="truncate">{b.eventLocation}</b></p>
        </div>
        <Button asChild variant="outline" className="w-full"><Link href="/dashboard/customer/bookings">View My Bookings</Link></Button>
        <p className="text-xs text-muted-foreground">Need a different date? You can send another request for a new date.</p>
        <BookingDialog service={service} onBooked={onBooked} />
      </div>
    );
  } else {
    body = (
      <>
        <BookingDialog service={service} onBooked={onBooked} />
        <p className="text-center text-xs text-muted-foreground">No payment needed now — the vendor will review your request.</p>
      </>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">Starting at</p>
          <p className="font-heading text-4xl font-semibold text-primary">{formatPrice(service.price)}</p>
        </div>
        {body}
      </CardContent>
    </Card>
  );
}
