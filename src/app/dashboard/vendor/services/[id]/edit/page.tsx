"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, ErrorState, PageHeader } from "@/components/dashboard/widgets";
import { ServiceForm } from "@/components/services/ServiceForm";
import { useApi } from "@/hooks/useApi";
import type { Service } from "@/lib/types";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, status, reload } = useApi<Service>(`/api/vendor/services/${id}`);

  return (
    <>
      <PageHeader title="Edit service" description="Update your service details and images." />
      {loading ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <Skeleton className="h-[480px] rounded-xl" />
          <Skeleton className="h-[320px] rounded-xl" />
        </div>
      ) : status === 404 || status === 400 ? (
        <EmptyState
          icon={SearchX}
          title="Service not found"
          description="This service doesn't exist or doesn't belong to your account."
          action={<Button asChild><Link href="/dashboard/vendor/services">Back to My Services</Link></Button>}
        />
      ) : error || !data ? (
        <ErrorState message={error ?? "Could not load service"} onRetry={() => reload()} />
      ) : (
        <ServiceForm initial={data} />
      )}
    </>
  );
}
