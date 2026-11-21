import Image from "next/image";
import { BadgeCheck, CalendarClock, HandCoins, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { FadeUp, Stagger, StaggerItem } from "@/components/shared/Motion";
import { SectionHeading } from "./SectionHeading";

const benefits = [
  { icon: ShieldCheck, title: "Every listing reviewed", text: "Our team approves each service before couples can see it, so you browse real, verified offers." },
  { icon: HandCoins, title: "Transparent pricing", text: "Starting prices are shown upfront. Sort by price to find packages that fit your budget." },
  { icon: CalendarClock, title: "Track every request", text: "Send booking requests and follow their status — pending, accepted or rejected — from one dashboard." },
  { icon: MessagesSquare, title: "Direct to vendors", text: "Share your date, venue and wishes with the vendor in a single request. No middlemen." },
  { icon: BadgeCheck, title: "Featured partners", text: "Premium vendors earn a badge and top placement, making top professionals easy to spot." },
  { icon: Sparkles, title: "All in one place", text: "Six categories — from photography to fashion — so your whole team comes together on WedPlan." },
];

export function WhyChoose() {
  return (
    <section className="container-page grid items-center gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr]">
      <FadeUp className="relative hidden aspect-[4/5] overflow-hidden rounded-[2rem] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1100&q=70&auto=format&fit=crop"
          alt="Wedding table setting with flowers"
          fill
          sizes="40vw"
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-background/90 p-5 shadow-lg backdrop-blur">
          <p className="font-heading text-3xl font-semibold text-primary">6 categories</p>
          <p className="text-sm text-muted-foreground">One platform for your entire wedding team.</p>
        </div>
      </FadeUp>
      <div>
        <SectionHeading
          align="left"
          eyebrow="Why WedPlan"
          title="Why choose WedPlan?"
          description="We built WedPlan to take the guesswork out of hiring wedding professionals — for couples and vendors alike."
        />
        <Stagger className="grid gap-5 sm:grid-cols-2">
          {benefits.map((b) => (
            <StaggerItem key={b.title} className="rounded-2xl border bg-card p-5 transition hover:border-primary/30 hover:shadow-md">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <b.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-sans text-base font-semibold">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
