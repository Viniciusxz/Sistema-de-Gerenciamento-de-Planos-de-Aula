import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Edit, Trash2 } from "lucide-react";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { ConfirmModal } from "../components/ConfirmModal";
import { EmptyState } from "../components/EmptyState";
import { Loading } from "../components/Loading";
import { lessonPlansService } from "../services/lessonPlansService";
import type { LessonPlan } from "../types/lessonPlan";
import { formatDate } from "../utils/formatDate";

function ListSection({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
        <p className="mt-3 text-sm text-zinc-500">Nenhum item informado.</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
      <h2 className="text-base font-semibold text-zinc-950">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LessonPlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLessonPlan = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const response = await lessonPlansService.getById(id);
      setLessonPlan(response);
    } catch {
      setError("Não foi possível carregar os detalhes deste plano de aula.");
      setLessonPlan(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadLessonPlan();
  }, [loadLessonPlan]);

  async function confirmDelete() {
    if (!id) {
      return;
    }

    try {
      setIsDeleting(true);
      await lessonPlansService.remove(id);
      navigate("/planos");
    } catch {
      setError("Não foi possível excluir este plano de aula. Tente novamente.");
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  }

  if (isLoading) {
    return <Loading label="Carregando detalhes..." />;
  }

  if (error && !lessonPlan) {
    return (
      <EmptyState
        title="Plano de aula não encontrado"
        description={error}
        action={
          <Link
            to="/planos"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para listagem
          </Link>
        }
      />
    );
  }

  if (!lessonPlan) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            to="/planos"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </Link>
          <h1 className="text-2xl font-semibold text-zinc-950">{lessonPlan.tituloAula}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="teal">{lessonPlan.disciplina}</Badge>
            <Badge tone="amber">
              <CalendarDays className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(lessonPlan.dataPrevista)}
            </Badge>
            <Badge>Cadastro: {formatDate(lessonPlan.dataCadastro)}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/planos/${lessonPlan.id}/editar`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            <Edit className="h-4 w-4" aria-hidden="true" />
            Editar
          </Link>
          <Button
            type="button"
            variant="danger"
            leftIcon={<Trash2 className="h-4 w-4" aria-hidden="true" />}
            onClick={() => setIsConfirmOpen(true)}
          >
            Excluir
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </div>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-zinc-950">Resumo</h2>
        <dl className="mt-4 grid gap-5 md:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-zinc-500">Objetivo</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{lessonPlan.objetivo}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-zinc-500">Ementa/Resumo</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-800">{lessonPlan.ementaResumo}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListSection title="Conteúdos" items={lessonPlan.conteudos} />
        <ListSection title="Recursos de Apoio" items={lessonPlan.recursosApoio} />
      </div>

      <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-zinc-950">Tags</h2>
        {lessonPlan.tags && lessonPlan.tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {lessonPlan.tags.map((tag) => (
              <Badge key={tag} tone="teal">
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-zinc-500">Nenhuma tag informada.</p>
        )}
      </section>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Excluir plano de aula"
        description={`Deseja excluir "${lessonPlan.tituloAula}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
