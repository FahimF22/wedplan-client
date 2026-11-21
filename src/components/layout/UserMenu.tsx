"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, UserCog } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { dashboardPath, signOut } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

type MenuUser = { name: string; email: string; image?: string | null; role?: string | null };

export function useLogout() {
  const router = useRouter();
  return async () => {
    try {
      await signOut();
      clearToken();
      toast.success("You have been signed out");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
    }
  };
}

export function UserMenu({ user }: { user: MenuUser }) {
  const logout = useLogout();
  const dash = dashboardPath(user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 rounded-full p-0.5 pr-1 outline-none ring-offset-2 transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open profile menu"
      >
        <UserAvatar name={user.name} image={user.image} />
        <span className="hidden max-w-32 truncate text-sm font-medium lg:inline">{user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-3 py-2 font-normal">
          <UserAvatar name={user.name} image={user.image} className="size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            {user.role ? (
              <Badge variant="secondary" className="mt-1 capitalize">
                {user.role}
              </Badge>
            ) : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dash}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={user.role ? `${dash}/profile` : dash}>
            <UserCog /> Profile Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout} variant="destructive">
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
