"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Heart, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/shared/FormField";
import { AvatarPicker } from "@/components/shared/ImagePicker";
import { GoogleButton, OrDivider } from "@/components/auth/GoogleButton";
import { dashboardPath, signUp } from "@/lib/auth-client";
import { api, clearToken, errorMessage, uploadImage } from "@/lib/api";
import { signUpSchema, type SignUpValues } from "@/lib/validators";
import { cn } from "@/lib/utils";

const roles = [
  { value: "customer", title: "I'm planning a wedding", desc: "Browse and book vendors", icon: Heart },
  { value: "vendor", title: "I'm a wedding vendor", desc: "List services, get bookings", icon: Store },
] as const;

export function SignUpForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [step, setStep] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", role: "customer", businessName: "" },
  });
  const role = watch("role");
  const name = watch("name");
  const password = watch("password") ?? "";

  const onSubmit = async (values: SignUpValues) => {
    setStep("Creating your account…");
    const { data, error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
      businessName: values.role === "vendor" ? values.businessName : undefined,
    });
    if (error) {
      setStep(null);
      toast.error(error.message || "Could not create your account");
      return;
    }
    clearToken();

    if (photo) {
      try {
        setStep("Uploading your photo…");
        const url = await uploadImage(photo);
        await api("/api/users/me", { method: "PATCH", body: { image: url } });
      } catch (err) {
        toast.warning(`Account created, but the photo upload failed: ${errorMessage(err)}. You can add it later in Profile Settings.`);
      }
    }

    toast.success("Account created successfully! Welcome to WedPlan.");
    router.push(dashboardPath(data?.user ? (data.user as { role?: string }).role : values.role));
    router.refresh();
  };

  const rules = [
    { ok: password.length >= 6, label: "6+ characters" },
    { ok: /[A-Z]/.test(password), label: "Uppercase" },
    { ok: /[a-z]/.test(password), label: "Lowercase" },
  ];

  return (
    <>
      <GoogleButton label="Sign up with Google" />
      <OrDivider />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField label="Account type" required error={errors.role?.message}>
          <div className="grid grid-cols-2 gap-3" role="radiogroup">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={role === r.value}
                onClick={() => setValue("role", r.value, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition",
                  role === r.value ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/40",
                )}
              >
                <r.icon className={cn("size-5", role === r.value ? "text-primary" : "text-muted-foreground")} />
                <span className="text-sm font-semibold">{r.title}</span>
                <span className="text-xs text-muted-foreground">{r.desc}</span>
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Full name" htmlFor="name" required error={errors.name?.message}>
          <Input id="name" autoComplete="name" className="h-11" placeholder="e.g. Ayesha Rahman" {...register("name")} aria-invalid={!!errors.name} />
        </FormField>

        {role === "vendor" ? (
          <FormField label="Business name" htmlFor="businessName" required error={errors.businessName?.message}>
            <Input id="businessName" className="h-11" placeholder="e.g. Golden Hour Studio" {...register("businessName")} aria-invalid={!!errors.businessName} />
          </FormField>
        ) : null}

        <FormField label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" className="h-11" placeholder="you@example.com" {...register("email")} aria-invalid={!!errors.email} />
        </FormField>

        <FormField label="Password" htmlFor="password" required error={errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
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
          <div className="flex flex-wrap gap-2 pt-1">
            {rules.map((r) => (
              <span
                key={r.label}
                className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", r.ok ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}
              >
                {r.ok ? "✓ " : ""}
                {r.label}
              </span>
            ))}
          </div>
        </FormField>

        <FormField label="Profile photo (optional)" hint="JPG, PNG or WEBP up to 5MB — hosted on ImgBB.">
          <AvatarPicker file={photo} onChange={setPhoto} name={name} />
        </FormField>

        <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" /> {step ?? "Please wait…"}
            </>
          ) : (
            "Create account"
          )}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
}
