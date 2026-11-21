import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, ensureDbConnected } from "./auth";

export async function getSession() {
  try {
    await ensureDbConnected();
    return await auth.api.getSession({ headers: await headers() });
  } catch {
    return null;
  }
}

/** Require a signed-in, non-blocked user; optionally a specific role. */
export async function requireUser(opts: { role?: "admin" | "vendor" | "customer"; redirectTo?: string } = {}) {
  const session = await getSession();
  if (!session) redirect(`/signin${opts.redirectTo ? `?redirect=${encodeURIComponent(opts.redirectTo)}` : ""}`);
  const user = session.user as typeof session.user & { role?: string | null; isBlocked?: boolean };
  if (user.isBlocked) redirect("/blocked");
  if (!user.role) redirect("/onboarding");
  if (opts.role && user.role !== opts.role) redirect(`/dashboard/${user.role}`);
  return { session, user };
}
