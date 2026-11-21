import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function VendorLayout({ children }: LayoutProps<"/dashboard/vendor">) {
  return <RoleLayout role="vendor">{children}</RoleLayout>;
}
