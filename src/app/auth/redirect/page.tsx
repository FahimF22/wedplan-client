import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/** Lands here after sign-in (incl. Google) and forwards the user by role. */
export default async function AuthRedirectPage({ searchParams }: PageProps<"/auth/redirect">) {
  const session = await getSession();
  if (!session) redirect("/signin");
  const user = session.user as { role?: string | null; isBlocked?: boolean };
  if (user.isBlocked) redirect("/blocked");
  if (!user.role) redirect("/onboarding");

  const { redirect: next } = await searchParams;
  const target = typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : null;
  redirect(target ?? `/dashboard/${user.role}`);
}
