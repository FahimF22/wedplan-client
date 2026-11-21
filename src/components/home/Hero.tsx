"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarHeart, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const HERO = "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=2000&q=70&auto=format&fit=crop";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative isolate overflow-hidden">
      <Image src={HERO} alt="Bride and groom at a candle-lit wedding reception" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(0.18_0.03_158/0.92)] via-[oklch(0.2_0.03_158/0.7)] to-[oklch(0.2_0.03_158/0.2)]" />

      <div className="container-page flex min-h-[78vh] flex-col justify-center py-24 text-white md:min-h-[86vh]">
        <motion.p {...rise(0)} className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm backdrop-blur">
          <Star className="size-4 fill-[var(--gold)] text-[var(--gold)]" /> Trusted by couples across Bangladesh
        </motion.p>
        <motion.h1 {...rise(0.1)} className="max-w-3xl text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
          Plan the wedding you <span className="italic text-[var(--gold)]">dreamed of</span>, with vendors you can trust
        </motion.h1>
        <motion.p {...rise(0.2)} className="mt-6 max-w-xl text-lg text-white/80">
          Discover photographers, venues, florists, caterers, makeup artists and designers in one place — compare packages,
          check availability and send booking requests in minutes.
        </motion.p>
        <motion.div {...rise(0.3)} className="mt-9 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 rounded-full bg-[var(--gold)] px-7 text-base text-[var(--gold-foreground)] hover:bg-[var(--gold)]/90">
            <Link href="/services">
              Explore Wedding Services <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-white/5 px-7 text-base text-white hover:bg-white/15 hover:text-white">
            <Link href="/signup">List your business</Link>
          </Button>
        </motion.div>
        <motion.div {...rise(0.45)} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/75">
          <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-[var(--gold)]" /> Admin-reviewed vendors</span>
          <span className="flex items-center gap-2"><CalendarHeart className="size-4 text-[var(--gold)]" /> Track every booking request</span>
        </motion.div>
      </div>
    </section>
  );
}
