import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { getSession } from "@/lib/session";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  const session = await getSession();
  if (session) {
    const { redirect: next } = await searchParams;
    redirect(`/auth/redirect${typeof next === "string" ? `?redirect=${encodeURIComponent(next)}` : ""}`);
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to manage your bookings, services and plans."
      image="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1200&q=70&auto=format&fit=crop"
      quote="“Every request, every reply, every booking — all in one calm place.”"
    >
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthShell>
  );
}
