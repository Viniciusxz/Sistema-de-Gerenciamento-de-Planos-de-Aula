import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.API_PORT ?? 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "database", "lesson-plans.json");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    ...corsHeaders,
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function sendEmpty(response, statusCode = 204) {
  response.writeHead(statusCode, corsHeaders);
  response.end();
}

async function readPlans() {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function writePlans(plans) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(plans, null, 2));
}

async function readBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function normalizeText(value = "") {
  return String(value ?? "").trim().toLocaleLowerCase("pt-BR");
}

function matchesFilters(plan, params) {
  const search = normalizeText(params.get("search"));
  const disciplina = normalizeText(params.get("disciplina"));
  const tag = normalizeText(params.get("tag"));
  const dataPrevista = params.get("dataPrevista");

  const matchesSearch = search
    ? normalizeText(plan.tituloAula).includes(search)
    : true;
  const matchesDisciplina = disciplina
    ? normalizeText(plan.disciplina) === disciplina
    : true;
  const matchesTag = tag
    ? (plan.tags ?? []).some((item) => normalizeText(item).includes(tag))
    : true;
  const matchesDate = dataPrevista
    ? String(plan.dataPrevista).slice(0, 10) === dataPrevista
    : true;

  return matchesSearch && matchesDisciplina && matchesTag && matchesDate;
}

function sortPlans(plans, params) {
  const sortBy = params.get("sortBy") ?? "dataCadastro";
  const order = params.get("order") ?? "desc";
  const direction = order === "asc" ? 1 : -1;

  return [...plans].sort((current, next) => {
    const currentValue = String(current[sortBy] ?? "");
    const nextValue = String(next[sortBy] ?? "");
    return currentValue.localeCompare(nextValue, "pt-BR") * direction;
  });
}

function paginate(plans, params) {
  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? (plans.length || 10));
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

function createLessonPlan(payload) {
  return {
    id: randomUUID(),
    tituloAula: String(payload.tituloAula ?? "").trim(),
    objetivo: String(payload.objetivo ?? "").trim(),
    ementaResumo: String(payload.ementaResumo ?? "").trim(),
    dataPrevista: payload.dataPrevista,
    disciplina: String(payload.disciplina ?? "").trim(),
    conteudos: Array.isArray(payload.conteudos) ? payload.conteudos : [],
    recursosApoio: Array.isArray(payload.recursosApoio) ? payload.recursosApoio : [],
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    dataCadastro: new Date().toISOString(),
  };
}

function getRecommendations(payload) {
  const titleWords = String(payload.tituloAula ?? "")
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, "").toLocaleLowerCase("pt-BR"))
    .filter((word) => word.length > 3)
    .slice(0, 3);
  const disciplina = String(payload.disciplina ?? "aula").trim();
  const baseTags = [
    ...titleWords,
    disciplina.split(/\s+/)[0]?.toLocaleLowerCase("pt-BR"),
  ].filter(Boolean);

  return {
    conteudosComplementares: [
      `Conceitos fundamentais de ${payload.tituloAula}`,
      `Aplicacoes praticas em ${disciplina}`,
      "Exercicios guiados e estudo de caso",
    ],
    topicosRelacionados: [
      `Fundamentos de ${disciplina}`,
      "Avaliacao formativa",
      "Materiais de apoio para revisao",
    ],
    tagsRecomendadas: Array.from(new Set(baseTags)).slice(0, 5),
  };
}

async function handleLessonPlans(request, response, url) {
  const [, , id] = url.pathname.split("/");
  const plans = await readPlans();

  if (request.method === "GET" && !id) {
    const filtered = plans.filter((plan) => matchesFilters(plan, url.searchParams));
    return sendJson(response, 200, paginate(sortPlans(filtered, url.searchParams), url.searchParams));
  }

  if (request.method === "GET" && id) {
    const plan = plans.find((item) => item.id === id);
    return plan
      ? sendJson(response, 200, plan)
      : sendJson(response, 404, { message: "Plano de aula nao encontrado." });
  }

  if (request.method === "POST" && !id) {
    const payload = await readBody(request);
    const plan = createLessonPlan(payload);
    await writePlans([plan, ...plans]);
    return sendJson(response, 201, plan);
  }

  if (request.method === "PUT" && id) {
    const payload = await readBody(request);
    const index = plans.findIndex((item) => item.id === id);

    if (index === -1) {
      return sendJson(response, 404, { message: "Plano de aula nao encontrado." });
    }

    const updated = { ...plans[index], ...payload, id: plans[index].id };
    plans[index] = updated;
    await writePlans(plans);
    return sendJson(response, 200, updated);
  }

  if (request.method === "DELETE" && id) {
    const nextPlans = plans.filter((item) => item.id !== id);

    if (nextPlans.length === plans.length) {
      return sendJson(response, 404, { message: "Plano de aula nao encontrado." });
    }

    await writePlans(nextPlans);
    return sendEmpty(response);
  }

  return sendJson(response, 405, { message: "Metodo nao permitido." });
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === "OPTIONS") {
      return sendEmpty(response);
    }

    const url = new URL(request.url ?? "/", `http://${request.headers.host}`);

    if (url.pathname === "/") {
      return sendJson(response, 200, { message: "API rodando" });
    }

    if (url.pathname === "/smart-assist/recommendations" && request.method === "POST") {
      const payload = await readBody(request);
      return sendJson(response, 200, getRecommendations(payload));
    }

    if (url.pathname === "/lesson-plans" || url.pathname.startsWith("/lesson-plans/")) {
      return handleLessonPlans(request, response, url);
    }

    return sendJson(response, 404, { message: "Rota nao encontrada." });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { message: "Erro interno da API." });
  }
});

server.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
