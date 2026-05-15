import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-teal-700 text-white shadow-soft hover:bg-teal-800 focus-visible:ring-teal-600",
  secondary:
    "bg-zinc-900 text-white shadow-soft hover:bg-zinc-800 focus-visible:ring-zinc-700",
  outline:
    "border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 focus-visible:ring-teal-600",
  ghost: "text-zinc-700 hover:bg-zinc-100 focus-visible:ring-zinc-500",
  danger:
    "bg-rose-700 text-white shadow-soft hover:bg-rose-800 focus-visible:ring-rose-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : leftIcon}
      {children}
    </button>
  );
}
