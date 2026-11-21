import { RoleLayout } from "@/components/dashboard/RoleLayout";

export default function CustomerLayout({ children }: LayoutProps<"/dashboard/customer">) {
  return <RoleLayout role="customer">{children}</RoleLayout>;
}
