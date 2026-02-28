import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  suffix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({
  price,
  originalPrice,
  suffix = "pp",
  size = "md",
  className,
}: PriceTagProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {originalPrice && (
        <span className="text-slate-400 line-through text-sm">
          {formatPrice(originalPrice)}
        </span>
      )}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "font-bold text-slate-900",
            size === "sm" && "text-base",
            size === "md" && "text-xl",
            size === "lg" && "text-3xl"
          )}
        >
          {formatPrice(price)}
        </span>
        {suffix && (
          <span className="text-slate-500 text-sm font-normal">{suffix}</span>
        )}
      </div>
    </div>
  );
}
