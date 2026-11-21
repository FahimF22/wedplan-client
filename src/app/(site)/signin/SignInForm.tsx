"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { dashboardPath, signIn } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { signInSchema, type SignInValues } from "@/lib/validators";

const safeRedirect = (v: string | null) => (v && v.startsWith("/") && !v.startsWith("//") ? v : null);

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = safeRedirect(params.get("redirect"));
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    const err = params.get("error");
    if (err === "google") toast.error("Google sign-in failed or was cancelled");
    else if (err === "blocked") toast.error("Your account has been blocked. Please contact support.");
    else if (err) toast.error("Sign-in failed. Please try again.");
  }, [params]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values: SignInValues) => {
    const { data, error } = await signIn.email({ email: values.email, password: values.password });
    if (error) {
      toast.error(error.status === 401 ? "Invalid email or password" : error.message || "Sign in failed");
      return;
    }
    clearToken();
    const role = (data?.user as { role?: string | null } | undefined)?.role;
    toast.success(`Welcome back, ${data?.user?.name?.split(" ")[0] ?? "friend"}!`);
    router.push(role ? (redirectTo ?? dashboardPath(role)) : "/onboarding");
    router.refresh();
  };

  return (
    <>
      {redirectTo ? (
        <div className="mb-6 rounded-lg border border-accent bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
          Please sign in to continue.
        </div>
      ) : null}
      <GoogleButton label="Sign in with Google" redirect={redirectTo} />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" className="h-11" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
        </FormField>
        <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="current-password"
              className="h-11 pr-11"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={showPw ? "Hide password" : "Show password"}
            >
              {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </FormField>
        <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New to WedPlan?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </>
  );
}
