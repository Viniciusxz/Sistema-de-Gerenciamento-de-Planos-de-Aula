import Titulo from "../../database/models/titulo.js";

function normalizeText(value = "") {
  return String(value ?? "").trim().toLocaleLowerCase("pt-BR");
}

function deserializeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Mantem compatibilidade com valores antigos salvos como texto simples.
  }

  return String(value)
    .split(/\r?\n|;|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function serializeList(value) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value.map((item) => String(item).trim()).filter(Boolean));
  }

  return String(value).trim();
}

function formatDateValue(value) {
  if (!value) {
    return new Date().toISOString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value);
}

function toLessonPlan(record) {
  if (!record) {
    return null;
  }

  const data = typeof record.toJSON === "function" ? record.toJSON() : record;

  return {
    id: String(data.id),
    tituloAula: data.titulo ?? "",
    objetivo: data.objetivo ?? "",
    ementaResumo: data.ementa ?? "",
    dataPrevista: formatDateValue(data.dataPrevista).slice(0, 10),
    disciplina: data.disciplina ?? "",
    conteudos: deserializeList(data.conteudos),
    recursosApoio: deserializeList(data.recursosApoio),
    tags: deserializeList(data.tags),
    dataCadastro: formatDateValue(data.createdAt),
  };
}

function toDatabasePayload(data) {
  const payload = {};

  if (data.tituloAula !== undefined || data.titulo !== undefined) {
    payload.titulo = data.tituloAula ?? data.titulo;
  }

  if (data.objetivo !== undefined) {
    payload.objetivo = data.objetivo;
  }

  if (data.ementaResumo !== undefined || data.ementa !== undefined) {
    payload.ementa = data.ementaResumo ?? data.ementa;
  }

  if (data.dataPrevista !== undefined) {
    payload.dataPrevista = data.dataPrevista;
  }

  if (data.disciplina !== undefined) {
    payload.disciplina = data.disciplina;
  }

  if (data.conteudos !== undefined) {
    payload.conteudos = serializeList(data.conteudos);
  }

  if (data.recursosApoio !== undefined) {
    payload.recursosApoio = serializeList(data.recursosApoio);
  }

  if (data.tags !== undefined) {
    payload.tags = serializeList(data.tags);
  }

  return payload;
}

function matchesFilters(plan, params) {
  const search = normalizeText(params.search);
  const disciplina = normalizeText(params.disciplina);
  const tag = normalizeText(params.tag);

  const matchesSearch = search
    ? normalizeText(plan.tituloAula).includes(search)
    : true;
  const matchesDisciplina = disciplina
    ? normalizeText(plan.disciplina) === disciplina
    : true;
  const matchesTag = tag
    ? plan.tags.some((item) => normalizeText(item).includes(tag))
    : true;
  const matchesDate = params.dataPrevista
    ? plan.dataPrevista === params.dataPrevista
    : true;

  return matchesSearch && matchesDisciplina && matchesTag && matchesDate;
}

function sortPlans(plans, params) {
  const sortBy = params.sortBy ?? "dataCadastro";
  const order = params.order ?? "desc";
  const direction = order === "asc" ? 1 : -1;

  return [...plans].sort((current, next) => {
    const currentValue = String(current[sortBy] ?? "");
    const nextValue = String(next[sortBy] ?? "");
    return currentValue.localeCompare(nextValue, "pt-BR") * direction;
  });
}

function paginate(plans, params) {
  const page = Number(params.page ?? 1);
  const limit = Number(params.limit ?? (plans.length || 10));
  const total = plans.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;

  return {
    data: plans.slice(start, start + limit),
    total,
    page,
    limit,
    totalPages,
  };
}

const pegaTodos = async (params = {}) => {
  const inicio = Date.now();
  const planos = await Titulo.findAll();
  const mappedPlans = planos.map(toLessonPlan);
  const filteredPlans = mappedPlans.filter((plan) => matchesFilters(plan, params));
  const sortedPlans = sortPlans(filteredPlans, params);
  const latency = ((Date.now() - inicio) / 1000).toFixed(2);
  console.log(`[INFO] GET planos: Total=${planos.length}, Latency=${latency}s`);

  return paginate(sortedPlans, params);
};

const pegaUm = async (id) => {
  const inicio = Date.now();
  const plano = await Titulo.findByPk(id);
  const latency = ((Date.now() - inicio ) / 1000).toFixed(2);
  console.log(`[INFO] GET plano: ID=${id}, Found=${!!plano}, Latency=${latency}s`);
  
  return toLessonPlan(plano);
};

const criar = async (dados) => {
  const inicio = Date.now();
  const plano = await Titulo.create(toDatabasePayload(dados));
  const latency = ((Date.now() - inicio ) / 1000).toFixed(2);
  console.log(`[INFO] POST plano criado: Title="${dados.tituloAula}", Latency=${latency}s`);
  
  return toLessonPlan(plano);
};

const atualizar = async (id, dados) => {
  const inicio = Date.now();
  const plano = await Titulo.findByPk(id);

  if (!plano) {
    console.log(`[WARN] PUT plano: ID=${id} não encontrado.`);
    return null;
  }

  await plano.update(toDatabasePayload(dados));
  const latency = ((Date.now() - inicio ) / 1000).toFixed(2);
  console.log(`[INFO] PUT plano atualizado: ID=${id}, Latency=${latency}s`);
  return toLessonPlan(plano);
};

const excluir = async (id) => {
  const inicio = Date.now();
  const result = await Titulo.destroy({ where: { id } });
  const latency = ((Date.now() - inicio ) / 1000).toFixed(2);
  console.log(`[INFO] DELETE plano: ID=${id}, Latency=${latency}s`)
  return result;
};

export default { pegaTodos, pegaUm, criar, atualizar, excluir };
///