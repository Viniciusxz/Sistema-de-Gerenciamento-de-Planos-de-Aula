import express from "express";
import "dotenv/config";
import planoRoutes from "./modules/planos/plano.routes.js"

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/planos", planoRoutes);

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});