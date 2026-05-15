import express from "express";
import "dotenv/config";
import cors from "cors";
import sequelize from "./database/models/index.js";
import planoRoutes from "./modules/planos/plano.routes.js";

const app = express();
const PORT = Number(process.env.API_PORT ?? 3000);

app.use(cors());
app.use(express.json());
app.use("/lesson-plans", planoRoutes);

function getSmartAssistRecommendations(payload) {
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

app.get("/", (req, res) => {
  res.json({ message: "API rodando" });
});

app.post("/smart-assist/recommendations", (req, res) => {
  res.json(getSmartAssistRecommendations(req.body));
});

await sequelize.sync();

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
