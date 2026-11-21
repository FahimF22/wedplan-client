import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { getSession } from "@/lib/session";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = { title: "Sign Up" };

export default async function SignUpPage() {
  const session = await getSession();
  if (session) redirect("/auth/redirect");

  return (
    <AuthShell title="Create your account" subtitle="Join as a couple planning a wedding, or as a vendor offering services.">
      <SignUpForm />
    </AuthShell>
  );
}
