import type { Metadata } from "next";
import { requireUser } from "@/lib/session";
import { ServiceDetails } from "./ServiceDetails";

export const metadata: Metadata = { title: "Service details" };

/** Private route — guests are redirected to Sign In and come back here afterwards. */
export default async function ServiceDetailsPage({ params }: PageProps<"/services/[id]">) {
  const { id } = await params;
  await requireUser({ redirectTo: `/services/${id}` });
  return <ServiceDetails />;
}
