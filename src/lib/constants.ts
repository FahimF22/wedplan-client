import { Camera, Building2, Flower2, UtensilsCrossed, Sparkles, Shirt, type LucideIcon } from "lucide-react";

export const CATEGORIES = [
  {
    value: "photography",
    label: "Photography & Videography",
    short: "Photography",
    icon: Camera,
    description: "Capture every vow, glance and dance floor moment.",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=70&auto=format&fit=crop",
  },
  {
    value: "venues",
    label: "Wedding Venues",
    short: "Venues",
    icon: Building2,
    description: "Gardens, ballrooms and waterfront halls for your big day.",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=70&auto=format&fit=crop",
  },
  {
    value: "decoration",
    label: "Decoration & Florist",
    short: "Decor & Florals",
    icon: Flower2,
    description: "Stages, florals and lighting that set the mood.",
    image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=900&q=70&auto=format&fit=crop",
  },
  {
    value: "catering",
    label: "Catering Services",
    short: "Catering",
    icon: UtensilsCrossed,
    description: "Menus your guests will talk about for years.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=900&q=70&auto=format&fit=crop",
  },
  {
    value: "makeup",
    label: "Makeup & Styling",
    short: "Makeup",
    icon: Sparkles,
    description: "Bridal looks, hair and mehndi artistry.",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=900&q=70&auto=format&fit=crop",
  },
  {
    value: "fashion",
    label: "Wedding Fashion",
    short: "Fashion",
    icon: Shirt,
    description: "Bridal wear, sherwanis and made-to-measure tailoring.",
    image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=70&auto=format&fit=crop",
  },
] as const satisfies readonly {
  value: string;
  label: string;
  short: string;
  icon: LucideIcon;
  description: string;
  image: string;
}[];

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const categoryLabel = (value?: string | null) =>
  CATEGORIES.find((c) => c.value === value)?.label ?? value ?? "";

export const PREMIUM_PRICE = 29;
export const FREE_SERVICE_LIMIT = 3;

export const formatPrice = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
