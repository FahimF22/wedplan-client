"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState, PageHeader } from "@/components/dashboard/widgets";
import { FormField } from "@/components/shared/FormField";
import { AvatarPicker } from "@/components/shared/ImagePicker";
import { useApi } from "@/hooks/useApi";
import { api, errorMessage, uploadImage } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate } from "@/lib/constants";
import { profileSchema, type ProfileValues } from "@/lib/validators";
import type { Profile } from "@/lib/types";

export function ProfileSettings() {
  const { data, loading, error, reload, setData } = useApi<Profile>("/api/users/me");
  const { refetch } = useSession();
  const [photo, setPhoto] = useState<File | null>(null);
  const [step, setStep] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (data)
      reset({
        name: data.name,
        phone: data.phone ?? "",
        location: data.location ?? "",
        bio: data.bio ?? "",
        businessName: data.businessName ?? "",
      });
  }, [data, reset]);

  const onSubmit = async (values: ProfileValues) => {
    try {
      let image: string | undefined;
      if (photo) {
        setStep("Uploading photo…");
        try {
          image = await uploadImage(photo);
        } catch (err) {
          toast.error(`Image upload failed: ${errorMessage(err)}`);
          setStep(null);
          return;
        }
      }
      setStep("Saving…");
      // role and subscription are never sent — the server ignores them anyway
      const body: Record<string, unknown> = {
        name: values.name,
        phone: values.phone ?? "",
        location: values.location ?? "",
        bio: values.bio ?? "",
        ...(data?.role === "vendor" ? { businessName: values.businessName ?? "" } : {}),
        ...(image ? { image } : {}),
      };
      const res = await api<Profile>("/api/users/me", { method: "PATCH", body });
      setData(res.data);
      setPhoto(null);
      await refetch?.();
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(errorMessage(err, "Could not update your profile"));
    } finally {
      setStep(null);
    }
  };

  return (
    <>
      <PageHeader title="Profile Settings" description="Keep your personal information up to date." />
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-[460px] rounded-xl" />
        </div>
      ) : error || !data ? (
        <ErrorState message={error ?? "Could not load your profile"} onRetry={() => reload()} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-sans text-base">Profile photo</CardTitle>
              <CardDescription>Shown in the navbar and to vendors/customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <AvatarPicker file={photo} onChange={setPhoto} currentUrl={data.image} name={watch("name") || data.name} />
              <dl className="space-y-3 border-t pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd><Badge variant="secondary" className="capitalize">{data.role}</Badge></dd>
                </div>
                {data.role === "vendor" ? (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Plan</dt>
                    <dd className="font-medium capitalize">{data.subscriptionPlan}</dd>
                  </div>
                ) : null}
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Member since</dt>
                  <dd>{formatDate(data.createdAt)}</dd>
                </div>
              </dl>
              <p className="flex gap-2 text-xs text-muted-foreground">
                <Lock className="size-3.5 shrink-0" /> Your role{data.role === "vendor" ? " and subscription" : ""} can&apos;t be changed from here.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-sans text-base">Personal information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Full name" htmlFor="name" required error={errors.name?.message}>
                  <Input id="name" className="h-11" {...register("name")} aria-invalid={!!errors.name} />
                </FormField>
                <FormField label="Email" htmlFor="email" hint="Email can't be changed.">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="email" value={data.email} readOnly disabled className="h-11 pl-9" />
                  </div>
                </FormField>
                {data.role === "vendor" ? (
                  <FormField label="Business name" htmlFor="businessName" error={errors.businessName?.message} className="sm:col-span-2">
                    <Input id="businessName" className="h-11" {...register("businessName")} />
                  </FormField>
                ) : null}
                <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
                  <Input id="phone" type="tel" className="h-11" placeholder="+880 1XXX-XXXXXX" {...register("phone")} />
                </FormField>
                <FormField label="City / location" htmlFor="location" error={errors.location?.message}>
                  <Input id="location" className="h-11" placeholder="e.g. Dhaka" {...register("location")} />
                </FormField>
              </div>
              <FormField label="Bio" htmlFor="bio" error={errors.bio?.message} hint={data.role === "vendor" ? "Shown on your service pages." : "A short note about you."}>
                <Textarea id="bio" rows={4} {...register("bio")} />
              </FormField>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="ghost" disabled={isSubmitting || (!isDirty && !photo)} onClick={() => { reset(); setPhoto(null); }}>
                  Discard
                </Button>
                <Button type="submit" disabled={isSubmitting || (!isDirty && !photo)}>
                  {isSubmitting ? <><Loader2 className="animate-spin" /> {step ?? "Saving…"}</> : "Save changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}
    </>
  );
}
