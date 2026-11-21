import { Suspense } from "react";
import { TableSkeleton } from "@/components/dashboard/widgets";
import { ManageServices } from "./ManageServices";

export default function AdminServicesPage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <ManageServices />
    </Suspense>
  );
}
