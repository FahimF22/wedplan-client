import Image from "next/image";
import { Logo } from "@/components/layout/Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  image = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=70&auto=format&fit=crop",
  quote = "“We found our photographer, florist and venue in one weekend. WedPlan made the whole thing feel calm.”",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  image?: string;
  quote?: string;
}) {
  return (
    <div className="grid flex-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src={image} alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.2_0.04_158/0.9)] via-[oklch(0.2_0.04_158/0.35)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-4 p-12 text-white">
          <p className="max-w-md font-heading text-3xl leading-snug">{quote}</p>
          <p className="text-sm text-white/70">— Nusrat &amp; Arif, married in Sylhet</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-4xl font-semibold text-foreground">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
