import type {
  CreateLessonPlanDTO,
  LessonPlan,
  LessonPlanQueryParams,
  PaginatedResponse,
  SmartAssistRequest,
  SmartAssistResponse,
  UpdateLessonPlanDTO,
} from "../types/lessonPlan";

const STORAGE_KEY = "lesson-plans-local-fallback";

function readPlans(): LessonPlan[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as LessonPlan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writePlans(plans: LessonPlan[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

function createId() {
  if (globalThis.crypto && "randomUUID" in globalThis.crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeText(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

function matchesFilters(plan: LessonPlan, params: LessonPlanQueryParams) {
  const search = normalizeText(params.search ?? "");
  const disciplina = normalizeText(params.disciplina ?? "");
  const tag = normalizeText(params.tag ?? "");

  const matchesSearch = search
    ? normalizeText(plan.tituloAula).includes(search)
    : true;
  const matchesDisciplina = disciplina
    ? normalizeText(plan.disciplina) === disciplina
    : true;
  const matchesTag = tag
    ? (plan.tags ?? []).some((item) => normalizeText(item).includes(tag))
    : true;
  const matchesDate = params.dataPrevista
    ? plan.dataPrevista.slice(0, 10) === params.dataPrevista
    : true;

  return matchesSearch && matchesDisciplina && matchesTag && matchesDate;
}

function sortPlans(plans: LessonPlan[], params: LessonPlanQueryParams) {
  const sortBy = params.sortBy ?? "dataCadastro";
  const order = params.order ?? "desc";
  const direction = order === "asc" ? 1 : -1;

  return [...plans].sort((current, next) => {
    const currentValue = current[sortBy] ?? "";
    const nextValue = next[sortBy] ?? "";
    return currentValue.localeCompare(nextValue, "pt-BR") * direction;
  });
}

export const localLessonPlansStore = {
  list(params: LessonPlanQueryParams): PaginatedResponse<LessonPlan> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;
    const filtered = sortPlans(readPlans().filter((plan) => matchesFilters(plan, params)), params);
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return { data, total, page, limit, totalPages };
  },

  getById(id: string) {
    const plan = readPlans().find((item) => item.id === id);

    if (!plan) {
      throw new Error("Plano de aula não encontrado.");
    }

    return plan;
  },

  create(data: CreateLessonPlanDTO) {
    const plan: LessonPlan = {
      ...data,
      id: createId(),
      dataCadastro: new Date().toISOString(),
    };

    writePlans([plan, ...readPlans()]);
    return plan;
  },

  update(id: string, data: UpdateLessonPlanDTO) {
    let updatedPlan: LessonPlan | null = null;
    const plans = readPlans().map((plan) => {
      if (plan.id !== id) {
        return plan;
      }

      updatedPlan = { ...plan, ...data };
      return updatedPlan;
    });

    if (!updatedPlan) {
      throw new Error("Plano de aula não encontrado.");
    }

    writePlans(plans);
    return updatedPlan;
  },

  remove(id: string) {
    writePlans(readPlans().filter((plan) => plan.id !== id));
  },
};

export function getLocalSmartAssistRecommendations(
  payload: SmartAssistRequest,
): SmartAssistResponse {
  const titleWords = payload.tituloAula
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase("pt-BR"))
    .filter((word) => word.length > 3)
    .slice(0, 3);

  const baseTags = [
    ...titleWords,
    payload.disciplina.split(/\s+/)[0]?.toLocaleLowerCase("pt-BR"),
  ].filter(Boolean);

  return {
    conteudosComplementares: [
      `Conceitos fundamentais de ${payload.tituloAula}`,
      `Aplicações práticas em ${payload.disciplina}`,
      "Exercícios guiados e estudo de caso",
    ],
    topicosRelacionados: [
      `Fundamentos de ${payload.disciplina}`,
      "Avaliação formativa",
      "Materiais de apoio para revisão",
    ],
    tagsRecomendadas: Array.from(new Set(baseTags)).slice(0, 5),
  };
}
