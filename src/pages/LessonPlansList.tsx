import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Edit,
  Eye,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ConfirmModal } from "../components/ConfirmModal";
import { EmptyState } from "../components/EmptyState";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { Select } from "../components/Select";
import { lessonPlansService } from "../services/lessonPlansService";
import type { LessonPlan, LessonPlanQueryParams } from "../types/lessonPlan";
import { cn } from "../utils/cn";
import { formatDate } from "../utils/formatDate";

const DISCIPLINAS = [
  "Redes de Computadores",
  "Programação",
  "Banco de Dados",
  "Engenharia de Software",
  "Sistemas Operacionais",
  "Matemática",
];

const LIMIT = 6;

const actionLinkClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600";

export function LessonPlansList() {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [search, setSearch] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [tag, setTag] = useState("");
  const [dataPrevista, setDataPrevista] = useState("");
  const [sort, setSort] = useState<"tituloAula:asc" | "tituloAula:desc" | "dataCadastro:asc" | "dataCadastro:desc">(
    "dataCadastro:desc",
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [planToDelete, setPlanToDelete] = useState<LessonPlan | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const query = useMemo<LessonPlanQueryParams>(() => {
    const [sortBy, order] = sort.split(":") as [
      "tituloAula" | "dataCadastro",
      "asc" | "desc",
    ];

    return {
      page,
      limit: LIMIT,
      search: search || undefined,
      disciplina: disciplina || undefined,
      tag: tag || undefined,
      dataPrevista: dataPrevista || undefined,
      sortBy,
      order,
    };
  }, [dataPrevista, disciplina, page, search, sort, tag]);

  const loadLessonPlans = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await lessonPlansService.list(query);
      setLessonPlans(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch {
      setError("Não foi possível carregar os planos de aula. Verifique a API e tente novamente.");
      setLessonPlans([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void loadLessonPlans();
  }, [loadLessonPlans]);

  function resetFilters() {
    setSearch("");
    setDisciplina("");
    setTag("");
    setDataPrevista("");
    setSort("dataCadastro:desc");
    setPage(1);
  }

  async function confirmDelete() {
    if (!planToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      await lessonPlansService.remove(planToDelete.id);
      setPlanToDelete(null);
      if (lessonPlans.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await loadLessonPlans();
      }
    } catch {
      setError("Não foi possível excluir o plano de aula. Tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">Planos de Aula</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {total > 0 ? `${total} plano(s) encontrado(s)` : "Organize aulas e recomendações pedagógicas."}
          </p>
        </div>
        <Link
          to="/planos/novo"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-medium text-white shadow-soft transition hover:bg-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo Plano
        </Link>
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft">
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr_auto]">
          <Input
            label="Buscar por Título da Aula"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Ex.: Introdução ao OSPF"
          />
          <Select
            label="Disciplina"
            value={disciplina}
            onChange={(event) => {
              setDisciplina(event.target.value);
              setPage(1);
            }}
          >
            <option value="">Todas</option>
            {DISCIPLINAS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Input
            label="Tag"
            value={tag}
            onChange={(event) => {
              setTag(event.target.value);
              setPage(1);
            }}
            placeholder="Ex.: redes"
          />
          <Input
            label="Data Prevista"
            type="date"
            value={dataPrevista}
            onChange={(event) => {
              setDataPrevista(event.target.value);
              setPage(1);
            }}
          />
          <Select
            label="Ordenação"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as typeof sort);
              setPage(1);
            }}
          >
            <option value="dataCadastro:desc">Cadastro mais recente</option>
            <option value="dataCadastro:asc">Cadastro mais antigo</option>
            <option value="tituloAula:asc">Título A-Z</option>
            <option value="tituloAula:desc">Título Z-A</option>
          </Select>
          <div className="flex items-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="w-full lg:w-auto"
              onClick={resetFilters}
              leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
            >
              Limpar
            </Button>
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={loadLessonPlans}>
              Tentar novamente
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <Loading label="Carregando planos de aula..." />
      ) : lessonPlans.length === 0 ? (
        <EmptyState
          title="Nenhum plano de aula encontrado"
          description="Ajuste os filtros ou cadastre um novo plano para começar."
          action={
            <Link
              to="/planos/novo"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo Plano
            </Link>
          }
        />
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-soft lg:block">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Aula
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Disciplina
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Data Prevista
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Tags
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-600">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {lessonPlans.map((plan) => (
                  <tr key={plan.id} className="transition hover:bg-zinc-50">
                    <td className="max-w-md px-5 py-4">
                      <div className="font-medium text-zinc-950">{plan.tituloAula}</div>
                      <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                        {plan.ementaResumo}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-sm text-zinc-700">{plan.disciplina}</td>
                    <td className="px-5 py-4 text-sm text-zinc-700">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                        {formatDate(plan.dataPrevista)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex max-w-xs flex-wrap gap-2">
                        {(plan.tags ?? []).slice(0, 3).map((item) => (
                          <Badge key={item} tone="teal">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link className={actionLinkClass} to={`/planos/${plan.id}`} aria-label="Visualizar">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                          className={actionLinkClass}
                          to={`/planos/${plan.id}/editar`}
                          aria-label="Editar"
                        >
                          <Edit className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          className={cn(actionLinkClass, "text-rose-700 hover:bg-rose-50")}
                          onClick={() => setPlanToDelete(plan)}
                          aria-label="Excluir"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:hidden">
            {lessonPlans.map((plan) => (
              <article key={plan.id} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-zinc-950">{plan.tituloAula}</h2>
                    <p className="mt-1 text-sm text-zinc-600">{plan.disciplina}</p>
                  </div>
                  <Badge tone="amber">{formatDate(plan.dataPrevista)}</Badge>
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">{plan.ementaResumo}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(plan.tags ?? []).map((item) => (
                    <Badge key={item} tone="teal">
                      {item}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <Link className={actionLinkClass} to={`/planos/${plan.id}`} aria-label="Visualizar">
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link className={actionLinkClass} to={`/planos/${plan.id}/editar`} aria-label="Editar">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className={cn(actionLinkClass, "text-rose-700 hover:bg-rose-50")}
                    onClick={() => setPlanToDelete(plan)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <span>
              Página {page} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Anterior
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              >
                Próxima
              </Button>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(planToDelete)}
        title="Excluir plano de aula"
        description={`Deseja excluir "${planToDelete?.tituloAula ?? ""}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
        onClose={() => setPlanToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
