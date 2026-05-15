// plano de estudo routes
import { Router } from "express";
import planoController from "./plano.controller.js";

const router = Router();

router.get("/", planoController.pegaTodos);
router.get("/:id", planoController.pegaUm);
router.post('/', planoController.criarUm);
router.put('/:id', planoController.atualizarUm);
router.delete('/:id', planoController.excluirUm);

export default router;