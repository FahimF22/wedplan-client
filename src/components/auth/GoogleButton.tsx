"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

export function GoogleButton({ label = "Continue with Google", redirect }: { label?: string; redirect?: string | null }) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const next = redirect && redirect.startsWith("/") ? redirect : "";
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: `/auth/redirect${next ? `?redirect=${encodeURIComponent(next)}` : ""}`,
      newUserCallbackURL: "/onboarding",
      errorCallbackURL: "/signin?error=google",
    });
    if (error) {
      toast.error(error.message || "Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="outline" size="lg" className="h-11 w-full" onClick={onClick} disabled={loading}>
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.6 2.3 2.3 6.6 2.3 12s4.3 9.7 9.7 9.7c5.6 0 9.3-3.9 9.3-9.5 0-.6-.1-1.1-.2-1.6H12Z" />
        </svg>
      )}
      {label}
    </Button>
  );
}

export function OrDivider() {
  return (
    <div className="relative my-6 text-center text-xs uppercase tracking-wider text-muted-foreground">
      <span className="relative z-10 bg-background px-3">or</span>
      <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
    </div>
  );
}
