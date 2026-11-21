"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/shared/FormField";
import { api, errorMessage } from "@/lib/api";
import { bookingSchema, type BookingValues } from "@/lib/validators";
import type { Booking, ServiceDetails } from "@/lib/types";

const todayStr = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export function BookingDialog({ service, onBooked }: { service: ServiceDetails; onBooked: (b: Booking) => void }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { eventDate: "", eventLocation: "", message: "" },
  });

  const onSubmit = async (values: BookingValues) => {
    try {
      const res = await api<Booking>("/api/customer/bookings", {
        method: "POST",
        // vendor and customer are identified on the server — only the service id is sent
        body: { serviceId: service._id, ...values },
      });
      toast.success("Booking request sent to the vendor!");
      onBooked(res.data);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(errorMessage(err, "Could not send the booking request"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !isSubmitting && setOpen(o)}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-12 w-full text-base">
          <CalendarHeart /> Request booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl">Request a booking</DialogTitle>
          <DialogDescription>
            {service.serviceName} · {service.vendor?.businessName || service.vendor?.name}
          </DialogDescription>
        </DialogHeader>
        <form id="booking-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <FormField label="Event date" htmlFor="eventDate" required error={errors.eventDate?.message}>
            <Input id="eventDate" type="date" min={todayStr()} className="h-11" {...register("eventDate")} aria-invalid={!!errors.eventDate} />
          </FormField>
          <FormField label="Event location" htmlFor="eventLocation" required error={errors.eventLocation?.message}>
            <Input id="eventLocation" className="h-11" placeholder="Venue name, city" {...register("eventLocation")} aria-invalid={!!errors.eventLocation} />
          </FormField>
          <FormField label="Message to the vendor" htmlFor="message" error={errors.message?.message} hint="Guest count, timings, style ideas — anything that helps.">
            <Textarea id="message" rows={4} placeholder="Hi! We're planning…" {...register("message")} />
          </FormField>
        </form>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" form="booking-form" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="animate-spin" /> Sending request…</> : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
