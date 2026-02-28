import { cn } from "@/lib/utils";
import type { HolidayType } from "@/types/holiday";

interface BadgeProps {
  children: React.ReactNode;
  variant?: HolidayType | "offer" | "default";
  className?: string;
}

const variantStyles: Record<string, string> = {
  ski: "bg-blue-100 text-blue-800",
  beach: "bg-cyan-100 text-cyan-800",
  city: "bg-purple-100 text-purple-800",
  summer: "bg-orange-100 text-orange-800",
  offer: "bg-accent-400 text-slate-900",
  default: "bg-slate-100 text-slate-700",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
        variantStyles[variant] ?? variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  );
}
