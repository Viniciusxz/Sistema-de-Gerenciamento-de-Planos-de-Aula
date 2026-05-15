import { NavLink } from "react-router-dom";
import { BookOpen, Plus } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/planos" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-700 text-white">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-base font-semibold text-zinc-950">Planos de Aula</span>
            <span className="hidden text-xs text-zinc-500 sm:block">Gestão pedagógica</span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink
            to="/planos"
            className={({ isActive }) =>
              `hidden rounded-md px-3 py-2 text-sm font-medium transition sm:inline-flex ${
                isActive ? "bg-zinc-100 text-zinc-950" : "text-zinc-600 hover:bg-zinc-100"
              }`
            }
          >
            Listagem
          </NavLink>
          <NavLink
            to="/planos/novo"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-teal-700 px-3 text-sm font-medium text-white shadow-soft transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo Plano
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
