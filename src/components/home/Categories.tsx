import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/Motion";
import { CATEGORIES } from "@/lib/constants";
import { publicGet } from "@/lib/server-api";
import { SectionHeading } from "./SectionHeading";

export async function Categories() {
  const counts = await publicGet<{ category: string; count: number }[]>("/api/services/categories");
  const countOf = (v: string) => counts?.find((c) => c.category === v)?.count;

  return (
    <section className="bg-secondary/60 py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow="Categories"
          title="Everything your wedding needs"
          description="Explore services by category and compare vendors side by side."
        />
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => {
            const n = countOf(c.value);
            return (
              <StaggerItem key={c.value}>
                <Link
                  href={`/services?category=${c.value}`}
                  className="group relative flex h-56 overflow-hidden rounded-2xl text-white shadow-sm"
                >
                  <Image src={c.image} alt={c.label} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                  <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-5">
                    <div>
                      <div className="mb-2 grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur">
                        <c.icon className="size-5" />
                      </div>
                      <h3 className="font-heading text-2xl font-semibold">{c.label}</h3>
                      <p className="text-sm text-white/80">{c.description}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      {typeof n === "number" ? (
                        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs backdrop-blur">{n} services</span>
                      ) : null}
                      <span className="grid size-9 place-items-center rounded-full bg-[var(--gold)] text-[var(--gold-foreground)] transition group-hover:rotate-45">
                        <ArrowUpRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
