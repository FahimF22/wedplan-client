import { Quote, Star } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/shared/Motion";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { SectionHeading } from "./SectionHeading";

const reviews = [
  {
    name: "Tasnim & Rafi",
    place: "Dhaka",
    text: "We booked our photographer and decorator within a week. Seeing every request's status in one place kept us sane.",
  },
  {
    name: "Mehjabin Akter",
    place: "Chattogram",
    text: "As a makeup artist, the dashboard makes it easy to accept requests. Premium put my studio at the top of search.",
  },
  {
    name: "Sadia & Imran",
    place: "Sylhet",
    text: "The price sorting and city filter saved us hours. Our caterer was wonderful and the whole process felt organised.",
  },
];

export function Testimonials() {
  return (
    <section className="container-page py-20">
      <SectionHeading eyebrow="Love notes" title="Stories from happy couples" description="A few words from people who planned with WedPlan." />
      <Stagger className="grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <StaggerItem key={r.name} className="flex flex-col rounded-2xl border bg-card p-6 shadow-xs">
            <Quote className="size-8 text-[var(--gold)]" />
            <p className="mt-4 flex-1 leading-relaxed text-foreground/85">{r.text}</p>
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserAvatar name={r.name} />
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.place}</p>
                </div>
              </div>
              <div className="flex text-[var(--gold)]" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
