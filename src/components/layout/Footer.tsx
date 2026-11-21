import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/constants";

function Social({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-[var(--gold)] hover:text-[var(--gold)]"
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

const socials = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    path: "M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z",
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3Zm0 7.7a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm6-7.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0ZM21.9 8c0-1.6-.4-3-1.6-4.2C19.1 2.6 17.7 2.2 16 2.1 14.4 2 9.6 2 8 2.1c-1.6.1-3 .5-4.2 1.7S2.2 6.4 2.1 8C2 9.6 2 14.4 2.1 16c.1 1.6.5 3 1.7 4.2s2.6 1.6 4.2 1.7c1.6.1 6.4.1 8 0 1.6-.1 3-.4 4.2-1.7 1.2-1.2 1.6-2.6 1.7-4.2.1-1.6.1-6.4 0-8Z",
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    path: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.9-2.5.9 0 1.3.7 1.3 1.5 0 .9-.6 2.2-.9 3.5-.2 1 .5 1.9 1.6 1.9 1.9 0 3.3-2 3.3-4.9 0-2.6-1.8-4.4-4.5-4.4-3 0-4.8 2.3-4.8 4.6 0 .9.4 1.9.8 2.4l.1.4-.3 1.2c0 .2-.2.3-.4.2-1.4-.7-2.2-2.7-2.2-4.3 0-3.5 2.5-6.7 7.3-6.7 3.8 0 6.8 2.7 6.8 6.4 0 3.8-2.4 6.9-5.8 6.9-1.1 0-2.2-.6-2.5-1.3l-.7 2.6c-.3 1-.9 2.2-1.4 2.9A10 10 0 1 0 12 2Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12c0 1.6.2 3.2.5 4.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.3-1.6.5-3.2.5-4.8s-.2-3.2-.5-4.8ZM9.8 15V9l5.8 3-5.8 3Z",
  },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-[oklch(0.25_0.035_158)] text-white/80">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-4">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/70">
            WedPlan brings trusted photographers, venues, decorators, caterers, stylists and designers together so you can
            plan the day you have always imagined — without the chaos.
          </p>
          <div className="flex gap-2">
            {socials.map((s) => (
              <Social key={s.label} {...s} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">Explore</h3>
          <ul className="space-y-2.5 text-sm">
            <li><Link className="hover:text-white" href="/">Home</Link></li>
            <li><Link className="hover:text-white" href="/services">Browse Services</Link></li>
            <li><Link className="hover:text-white" href="/signup">Become a Vendor</Link></li>
            <li><Link className="hover:text-white" href="/signin">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">Categories</h3>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.value}>
                <Link className="hover:text-white" href={`/services?category=${c.value}`}>
                  {c.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-sans text-sm font-semibold uppercase tracking-wider text-[var(--gold)]">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" /> House 12, Road 7, Gulshan-1, Dhaka 1212</li>
            <li className="flex gap-3"><Phone className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" /> <a href="tel:+8801700000000" className="hover:text-white">+880 1700-000000</a></li>
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" /> <a href="mailto:hello@wedplan.app" className="hover:text-white">hello@wedplan.app</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} WedPlan. All rights reserved.</p>
          <p>Made with care for couples and wedding professionals.</p>
        </div>
      </div>
    </footer>
  );
}
