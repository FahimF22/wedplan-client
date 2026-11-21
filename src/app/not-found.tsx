import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16 text-center">
      <Logo className="mb-12" />
      <p className="font-heading text-8xl font-semibold text-primary/20">404</p>
      <div className="-mt-6 grid size-16 place-items-center rounded-full bg-secondary text-primary">
        <Compass className="size-7" />
      </div>
      <h1 className="mt-6 text-4xl font-semibold">This page wandered off</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to planning.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link href="/">Go home</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/services">Browse services</Link></Button>
      </div>
    </div>
  );
}
