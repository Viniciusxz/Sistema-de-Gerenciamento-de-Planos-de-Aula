import { Loader2 } from "lucide-react";

interface LoadingProps {
  label?: string;
}

export function Loading({ label = "Carregando..." }: LoadingProps) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white">
      <div className="flex items-center gap-3 text-sm font-medium text-zinc-600">
        <Loader2 className="h-5 w-5 animate-spin text-teal-700" aria-hidden="true" />
        {label}
      </div>
    </div>
  );
}
