import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { OnboardingForm } from "./OnboardingForm";

export const metadata: Metadata = { title: "Choose your account type" };

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect("/signin?redirect=/onboarding");
  const user = session.user as typeof session.user & { role?: string | null; isBlocked?: boolean };
  if (user.isBlocked) redirect("/blocked");
  if (user.role) redirect(`/dashboard/${user.role}`);

  return (
    <section className="container-page flex flex-1 items-center justify-center py-16">
      <div className="w-full max-w-xl rounded-2xl border bg-card p-6 shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--gold)]">One last step</p>
        <h1 className="mt-2 text-4xl font-semibold">Welcome, {user.name.split(" ")[0]}!</h1>
        <p className="mt-2 text-muted-foreground">How will you use WedPlan? You can only choose this once.</p>
        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </section>
  );
}
