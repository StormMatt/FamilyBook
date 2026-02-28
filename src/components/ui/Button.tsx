import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        {
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm":
            variant === "primary",
          "bg-white text-primary-700 border border-primary-200 hover:bg-primary-50":
            variant === "secondary",
          "text-primary-600 hover:bg-primary-50": variant === "ghost",
          "border border-slate-300 text-slate-700 hover:bg-slate-50":
            variant === "outline",
        },
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-5 py-2.5 text-sm": size === "md",
          "px-7 py-3.5 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
