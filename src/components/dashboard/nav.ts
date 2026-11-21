import {
  CalendarCheck,
  CreditCard,
  Gem,
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Receipt,
  ShieldCheck,
  Store,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon };

export const NAV: Record<"vendor" | "customer" | "admin", NavItem[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/services", label: "My Services", icon: Store },
    { href: "/dashboard/vendor/services/new", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: CalendarCheck },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Gem },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: UserCog },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: ListChecks },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: ShieldCheck },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: Store },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/admin/profile", label: "Profile Settings", icon: UserCog },
  ],
};

export const roleTitle = { vendor: "Vendor", customer: "Customer", admin: "Admin" } as const;
export { CreditCard };
