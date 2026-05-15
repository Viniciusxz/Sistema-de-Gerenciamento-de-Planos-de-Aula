import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "../utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, rows = 4, ...props }, ref) => {
    return (
      <label className="block">
        {label && (
          <span className="mb-1.5 block text-sm font-medium text-zinc-800">{label}</span>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
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

Textarea.displayName = "Textarea";
