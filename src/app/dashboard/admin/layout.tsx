import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function AdminLayout({ children }: LayoutProps<"/dashboard/admin">) {
  return <RoleLayout role="admin">{children}</RoleLayout>;
}
