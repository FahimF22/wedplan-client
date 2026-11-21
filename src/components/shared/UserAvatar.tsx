import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");
}

export function UserAvatar({ name, image, className }: { name?: string | null; image?: string | null; className?: string }) {
  return (
    <Avatar className={cn("size-9", className)}>
      {image ? <AvatarImage src={image} alt={name ?? "User"} className="object-cover" /> : null}
      <AvatarFallback className="bg-secondary font-medium text-secondary-foreground">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
