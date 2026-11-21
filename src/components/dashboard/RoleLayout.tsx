import { requireUser } from "@/lib/session";
import { DashboardShell } from "./DashboardShell";

/** Server-side guard: wrong role is redirected to its own dashboard, guests to Sign In. */
export async function RoleLayout({ role, children }: { role: "admin" | "vendor" | "customer"; children: React.ReactNode }) {
  const { user } = await requireUser({ role, redirectTo: `/dashboard/${role}` });
  return (
    <DashboardShell user={{ name: user.name, email: user.email, image: user.image ?? null, role }}>{children}</DashboardShell>
  );
}
