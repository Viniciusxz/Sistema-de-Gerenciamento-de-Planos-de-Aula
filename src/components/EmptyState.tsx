import type { ReactNode } from "react";
import { FileSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700">
        <FileSearch className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-base font-semibold text-zinc-950">{title}</h2>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
