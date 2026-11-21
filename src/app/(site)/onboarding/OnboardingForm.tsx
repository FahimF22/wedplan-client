"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { api, errorMessage } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const roles = [
  { value: "customer", title: "Planning a wedding", desc: "Browse services and send booking requests", icon: Heart },
  { value: "vendor", title: "Wedding vendor", desc: "Publish services and manage bookings", icon: Store },
] as const;

export function OnboardingForm() {
  const router = useRouter();
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (role === "vendor" && businessName.trim().length < 2) {
      toast.error("Please enter your business name");
      return;
    }
    setLoading(true);
    try {
      await api("/api/users/me/role", { method: "POST", body: { role, businessName: role === "vendor" ? businessName : undefined } });
      await authClient.getSession({ query: { disableCookieCache: true } });
      toast.success("You're all set!");
      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch (err) {
      toast.error(errorMessage(err, "Could not save your choice"));
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {roles.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => setRole(r.value)}
            aria-pressed={role === r.value}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition",
              role === r.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/40",
            )}
          >
            <r.icon className={cn("size-6", role === r.value ? "text-primary" : "text-muted-foreground")} />
            <span className="font-semibold">{r.title}</span>
            <span className="text-sm text-muted-foreground">{r.desc}</span>
          </button>
        ))}
      </div>
      {role === "vendor" ? (
        <FormField label="Business name" htmlFor="biz" required>
          <Input id="biz" className="h-11" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Petal & Vine Florals" />
        </FormField>
      ) : null}
      <Button size="lg" className="h-11 w-full" onClick={submit} disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : null} Continue
      </Button>
    </div>
  );
}
