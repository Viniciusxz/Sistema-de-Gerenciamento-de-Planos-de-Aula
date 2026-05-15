import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Loading } from "../components/Loading";
import { Textarea } from "../components/Textarea";
import { lessonPlanSchema, type LessonPlanFormData } from "../schemas/lessonPlanSchema";
import { lessonPlansService } from "../services/lessonPlansService";
import { smartAssistService } from "../services/smartAssistService";
import type { CreateLessonPlanDTO, LessonPlan } from "../types/lessonPlan";

const defaultValues: LessonPlanFormData = {
  tituloAula: "",
  objetivo: "",
  ementaResumo: "",
  dataPrevista: "",
  disciplina: "",
  conteudos: "",
  recursosApoio: "",
  tags: "",
};

function listToTextarea(value?: string[] | string) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join("\n");
  }

  return value;
}

function listToTags(value?: string[] | string) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return value;
}

function splitMultiline(value?: string) {
  return (value ?? "")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTags(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toPayload(data: LessonPlanFormData): CreateLessonPlanDTO {
  return {
    tituloAula: data.tituloAula.trim(),
    objetivo: data.objetivo.trim(),
    ementaResumo: data.ementaResumo.trim(),
    dataPrevista: data.dataPrevista,
    disciplina: data.disciplina.trim(),
    conteudos: splitMultiline(data.conteudos),
    recursosApoio: splitMultiline(data.recursosApoio),
    tags: splitTags(data.tags),
  };
}

export function LessonPlanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [isLoadingPlan, setIsLoadingPlan] = useState(isEditing);
  const [pageError, setPageError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [aiError, setAiError] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const title = useMemo(() => (isEditing ? "Editar Plano" : "Novo Plano"), [isEditing]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<LessonPlanFormData>({
    resolver: zodResolver(lessonPlanSchema),
    defaultValues,
  });

  useEffect(() => {
    async function loadPlan(planId: string) {
      try {
        setIsLoadingPlan(true);
        setPageError("");
        const plan: LessonPlan = await lessonPlansService.getById(planId);
        reset({
          tituloAula: plan.tituloAula,
          objetivo: plan.objetivo,
          ementaResumo: plan.ementaResumo,
          dataPrevista: plan.dataPrevista?.slice(0, 10),
          disciplina: plan.disciplina,
          conteudos: listToTextarea(plan.conteudos),
          recursosApoio: listToTextarea(plan.recursosApoio),
          tags: listToTags(plan.tags),
        });
      } catch {
        setPageError("Não foi possível carregar este plano de aula para edição.");
      } finally {
        setIsLoadingPlan(false);
      }
    }

    if (id) {
      void loadPlan(id);
    }
  }, [id, reset]);

  async function onSubmit(data: LessonPlanFormData) {
    try {
      setSubmitError("");
      const payload = toPayload(data);
      const saved = id
        ? await lessonPlansService.update(id, payload)
        : await lessonPlansService.create(payload);

      navigate(`/planos/${saved.id}`);
    } catch {
      setSubmitError("Não foi possível salvar o plano de aula. Revise os dados e tente novamente.");
    }
  }

  async function handleSmartAssist() {
    const isValid = await trigger(["tituloAula", "disciplina", "ementaResumo"]);

    if (!isValid) {
      return;
    }

    try {
      setIsAiLoading(true);
      setAiError("");
      const { tituloAula, disciplina, ementaResumo } = getValues();
      const recommendations = await smartAssistService.getRecommendations({
        tituloAula,
        disciplina,
        ementaResumo,
      });

      const conteudos = [
        ...recommendations.conteudosComplementares,
        ...recommendations.topicosRelacionados,
      ];

      setValue("conteudos", conteudos.join("\n"), { shouldDirty: true, shouldValidate: true });
      setValue("tags", recommendations.tagsRecomendadas.join(", "), {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch {
      setAiError("Não foi possível gerar recomendações no momento. Tente novamente.");
    } finally {
      setIsAiLoading(false);
    }
  }

  if (isLoadingPlan) {
    return <Loading label="Carregando plano de aula..." />;
  }

  if (pageError) {
    return (
      <div className="rounded-md border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <p className="text-sm">{pageError}</p>
        <Link
          to="/planos"
          className="mt-4 inline-flex h-10 items-center gap-2 rounded-md border border-rose-200 bg-white px-4 text-sm font-medium text-rose-800 transition hover:bg-rose-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar para listagem
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">{title}</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Preencha as informações principais e use o Smart Assist quando quiser acelerar a curadoria.
          </p>
        </div>
        <Link
          to="/planos"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Voltar
        </Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Título da Aula"
              placeholder="Ex.: Introdução ao OSPF"
              error={errors.tituloAula?.message}
              {...register("tituloAula")}
            />
            <Input
              label="Disciplina"
              placeholder="Ex.: Redes de Computadores"
              error={errors.disciplina?.message}
              {...register("disciplina")}
            />
            <Input
              label="Data Prevista"
              type="date"
              error={errors.dataPrevista?.message}
              {...register("dataPrevista")}
            />
            <Textarea
              label="Objetivo"
              rows={3}
              placeholder="Descreva o objetivo da aula"
              error={errors.objetivo?.message}
              {...register("objetivo")}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Ementa/Resumo"
                rows={4}
                placeholder="Resumo dos temas e abordagem da aula"
                error={errors.ementaResumo?.message}
                {...register("ementaResumo")}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Smart Assist</h2>
              <p className="mt-1 text-sm text-zinc-600">
                Gere conteúdos complementares, tópicos relacionados e tags a partir dos campos principais.
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              isLoading={isAiLoading}
              disabled={isAiLoading || isSubmitting}
              onClick={handleSmartAssist}
              leftIcon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
            >
              Gerar Recomendações com IA
            </Button>
          </div>

          {aiError && (
            <div className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {aiError}
            </div>
          )}

          <div className="mt-5 grid gap-4">
            <Textarea
              label="Conteúdos"
              rows={6}
              placeholder="Um conteúdo por linha"
              error={errors.conteudos?.message}
              {...register("conteudos")}
            />
            <Textarea
              label="Recursos de Apoio"
              rows={4}
              placeholder="Slides, vídeos, laboratórios, leituras..."
              error={errors.recursosApoio?.message}
              {...register("recursosApoio")}
            />
            <Input
              label="Tags"
              placeholder="redes, ospf, roteamento"
              error={errors.tags?.message}
              {...register("tags")}
            />
          </div>
        </section>

        {submitError && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {submitError}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/planos"
            className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
          >
            Cancelar
          </Link>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" aria-hidden="true" />}
          >
            Salvar Plano
          </Button>
        </div>
      </form>
    </div>
  );
}
