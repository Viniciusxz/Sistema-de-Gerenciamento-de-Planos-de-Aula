import type { HTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "teal" | "amber" | "rose";
}

const toneClasses = {
  neutral: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  teal: "bg-teal-50 text-teal-800 ring-teal-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  rose: "bg-rose-50 text-rose-800 ring-rose-200",
};

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
