import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 28" aria-hidden className={cn("h-6 w-auto", className)} fill="none">
      <circle cx="14" cy="15" r="10" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="26" cy="15" r="10" stroke="var(--gold)" strokeWidth="2.4" />
      <path d="M26 2.5 28 5l-2 2-2-2z" fill="var(--gold)" />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2 font-heading text-2xl font-semibold tracking-tight", light ? "text-white" : "text-primary", className)}
      aria-label="WedPlan home"
    >
      <LogoMark />
      <span>WedPlan</span>
    </Link>
  );
}
