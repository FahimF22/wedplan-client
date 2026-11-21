"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gem, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField } from "@/components/shared/FormField";
import { MultiImageUpload } from "./MultiImageUpload";
import { CATEGORIES } from "@/lib/constants";
import { api, ApiError, errorMessage } from "@/lib/api";
import { serviceSchema, type ServiceValues } from "@/lib/validators";
import type { Service } from "@/lib/types";

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [imageError, setImageError] = useState<string>();
  const [uploading, setUploading] = useState(false);
  const [limitHit, setLimitHit] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ServiceValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: initial?.serviceName ?? "",
      category: initial?.category ?? "",
      description: initial?.description ?? "",
      price: initial?.price ?? (undefined as unknown as number),
      location: initial?.location ?? "",
    },
  });

  const onSubmit = async (values: ServiceValues) => {
    if (images.length === 0) {
      setImageError("Upload at least one image");
      toast.error("Please upload at least one service image");
      return;
    }
    setImageError(undefined);
    try {
      if (initial) {
        const res = await api(`/api/vendor/services/${initial._id}`, { method: "PATCH", body: { ...values, images } });
        toast.success(res.message ?? "Service updated");
      } else {
        await api("/api/vendor/services", { method: "POST", body: { ...values, images } });
        toast.success("Service submitted! It will be visible once an admin approves it.");
      }
      router.push("/dashboard/vendor/services");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && (err.details as { code?: string } | undefined)?.code === "PLAN_LIMIT_REACHED") {
        setLimitHit(true);
      }
      toast.error(errorMessage(err, "Could not save the service"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <Card>
        <CardContent className="space-y-5">
          <FormField label="Service name" htmlFor="serviceName" required error={errors.serviceName?.message}>
            <Input id="serviceName" className="h-11" placeholder="e.g. Full-day Wedding Photography" {...register("serviceName")} aria-invalid={!!errors.serviceName} />
          </FormField>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Category" required error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11 w-full" aria-invalid={!!errors.category}>
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
            <FormField label="Price (USD)" htmlFor="price" required error={errors.price?.message}>
              <Input id="price" type="number" min={1} step="1" inputMode="numeric" className="h-11" placeholder="1200" {...register("price")} aria-invalid={!!errors.price} />
            </FormField>
          </div>

          <FormField label="Location" htmlFor="location" required error={errors.location?.message}>
            <Input id="location" className="h-11" placeholder="e.g. Dhaka" {...register("location")} aria-invalid={!!errors.location} />
          </FormField>

          <FormField label="Description" htmlFor="description" required error={errors.description?.message} hint="What's included, packages, hours, team size…">
            <Textarea id="description" rows={7} placeholder="Describe your service…" {...register("description")} aria-invalid={!!errors.description} />
          </FormField>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3">
            <h2 className="font-sans text-base font-semibold">Service images <span className="text-destructive">*</span></h2>
            <MultiImageUpload value={images} onChange={(v) => { setImages(v); if (v.length) setImageError(undefined); }} error={imageError} onBusyChange={setUploading} />
          </CardContent>
        </Card>

        {limitHit ? (
          <Card className="border-[var(--gold)]/50 bg-[var(--gold)]/10">
            <CardContent className="space-y-3">
              <p className="flex items-center gap-2 font-semibold"><Gem className="size-4 text-[var(--gold)]" /> Free plan limit reached</p>
              <p className="text-sm text-muted-foreground">Free vendors can keep 3 active services. Upgrade to Premium for unlimited services, or pause one of your existing services.</p>
              <Button asChild size="sm"><Link href="/dashboard/vendor/subscription">Upgrade to Premium</Link></Button>
            </CardContent>
          </Card>
        ) : null}

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" className="h-11" disabled={isSubmitting || uploading}>
            {isSubmitting ? <><Loader2 className="animate-spin" /> Saving…</> : uploading ? "Waiting for uploads…" : initial ? "Save changes" : "Submit for review"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          {initial ? (
            <p className="text-center text-xs text-muted-foreground">Changing the name, category, description or images sends the service back for admin review.</p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">New services stay <b>Pending</b> until an admin approves them.</p>
          )}
        </div>
      </div>
    </form>
  );
}
