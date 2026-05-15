import express from "express";
import "dotenv/config";
import cors from "cors";
import planoRoutes from "./modules/planos/plano.routes.js"

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use("/lesson-plans", planoRoutes);

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});