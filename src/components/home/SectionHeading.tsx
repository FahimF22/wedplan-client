import { FadeUp } from "@/components/shared/Motion";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <FadeUp className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[oklch(0.58_0.11_75)]">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
    </FadeUp>
  );
}
