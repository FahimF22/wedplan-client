import { requireUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardIndex() {
  const { user } = await requireUser({ redirectTo: "/dashboard" });
  redirect(`/dashboard/${user.role}`);
}
