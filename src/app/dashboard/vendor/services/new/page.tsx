import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/widgets";
import { ServiceForm } from "@/components/services/ServiceForm";

export const metadata: Metadata = { title: "Add Service" };

export default function AddServicePage() {
  return (
    <>
      <PageHeader title="Add a new service" description="Tell couples what you offer. Great photos and a clear description get more bookings." />
      <ServiceForm />
    </>
  );
}
