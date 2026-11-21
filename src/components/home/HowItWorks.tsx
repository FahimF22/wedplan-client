import { CalendarCheck2, PartyPopper, Search, Send } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/Motion";
import { SectionHeading } from "./SectionHeading";

const steps = [
  { icon: Search, title: "Discover", text: "Search by name, filter by category and city, and sort by price." },
  { icon: Send, title: "Request", text: "Pick your event date and venue, add a note and send a booking request." },
  { icon: CalendarCheck2, title: "Confirm", text: "The vendor accepts or declines — you see the status update in your dashboard." },
  { icon: PartyPopper, title: "Celebrate", text: "Your team is set. Enjoy the day while the professionals take care of the rest." },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-[oklch(0.27_0.04_158)] py-20 text-white">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-[var(--gold)]/10 blur-3xl" />
      <div className="container-page relative">
        <SectionHeading eyebrow="How it works" title="How WedPlan works" description="From first search to the first dance in four simple steps." className="[&_p:last-child]:text-white/70" />
        <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <StaggerItem key={s.title} className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <span className="absolute right-5 top-4 font-heading text-5xl font-semibold text-white/10">0{i + 1}</span>
              <div className="grid size-12 place-items-center rounded-full bg-[var(--gold)] text-[var(--gold-foreground)]">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
