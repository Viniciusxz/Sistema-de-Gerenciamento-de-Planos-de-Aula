import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-zinc-800">{label}</span>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
            error && "border-rose-500 focus:border-rose-500 focus:ring-rose-100",
            className,
          )}
          {...props}
        />
        {error && <span className="mt-1 block text-sm text-rose-700">{error}</span>}
      </label>
    );
  },
);

Input.displayName = "Input";
