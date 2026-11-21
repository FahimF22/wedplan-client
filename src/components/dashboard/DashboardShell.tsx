"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { NAV, roleTitle } from "./nav";

type Role = keyof typeof NAV;
type ShellUser = { name: string; email: string; image?: string | null; role: Role };

function SideNav({ role, onNavigate }: { role: Role; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV[role];
  // the most specific matching item is active
  const active = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active === item.href
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <item.icon className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function DashboardShell({ user: initialUser, children }: { user: ShellUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  // live session (updates after profile edits); fall back to the server-provided user
  const user = { ...initialUser, ...(data?.user ? { name: data.user.name, image: data.user.image } : {}) };

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-sidebar px-4 py-5 lg:flex">
        <Logo className="px-2" />
        <Badge variant="secondary" className="mx-2 mt-3 w-fit">
          {roleTitle[user.role]} dashboard
        </Badge>
        <div className="mt-6 flex-1 overflow-y-auto">
          <SideNav role={user.role} />
        </div>
        <Link href="/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent">
          <ArrowLeft className="size-4" /> Back to website
        </Link>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open dashboard menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar">
                <SheetHeader>
                  <SheetTitle asChild>
                    <div>
                      <Logo />
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="px-4">
                  <SideNav role={user.role} onNavigate={() => setOpen(false)} />
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent"
                  >
                    <ArrowLeft className="size-4" /> Back to website
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-heading text-xl font-semibold lg:hidden">WedPlan</span>
            <span className="hidden text-sm text-muted-foreground lg:inline">
              Welcome back, <span className="font-medium text-foreground">{user.name.split(" ")[0]}</span>
            </span>
          </div>
          <UserMenu user={user} />
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
