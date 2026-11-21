"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Logo } from "./Logo";
import { UserMenu, useLogout } from "./UserMenu";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { dashboardPath, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const user = session?.user;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                  isActive(l.href) ? "text-primary" : "text-muted-foreground",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <Skeleton className="h-9 w-28 rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button asChild variant="ghost" size="lg">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-5">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] max-w-sm">
            <SheetHeader>
              <SheetTitle asChild>
                <div>
                  <Logo />
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-1 px-4">
              {user ? (
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted p-3">
                  <UserAvatar name={user.name} image={user.image} className="size-11" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{user.name}</p>
                    <p className="truncate text-xs capitalize text-muted-foreground">{user.role ?? "new member"}</p>
                  </div>
                </div>
              ) : null}
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn("rounded-lg px-3 py-2.5 font-medium hover:bg-muted", isActive(l.href) && "bg-muted text-primary")}
                >
                  {l.label}
                </Link>
              ))}
              <Separator className="my-3" />
              {user ? (
                <>
                  <Link href={dashboardPath(user.role)} onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-muted">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <Link
                    href={user.role ? `${dashboardPath(user.role)}/profile` : "/onboarding"}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 hover:bg-muted"
                  >
                    <UserCog className="size-4" /> Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              ) : isPending ? null : (
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="lg">
                    <Link href="/signin" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild size="lg">
                    <Link href="/signup" onClick={() => setOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
