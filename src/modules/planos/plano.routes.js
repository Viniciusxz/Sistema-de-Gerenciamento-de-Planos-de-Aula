// plano de estudo routes
import { Router } from "express";
import planoController from "./plano.controller.js";

const router = Router();

router.get("/titulo", planoController.pegaTodos);
router.get("/titulo/:id", planoController.pegaUm);
router.post('/titulo', planoController.criarUm);
router.put('/titulo/:id', planoController.atualizarUm);
router.delete('/titulo/:id', planoController.excluirUm);

export default router;