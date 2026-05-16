// plano de estudo routes
import { Router } from "express";
import planoController from "./plano.controller.js";
import {  validarCriarPlano, validarId } from "../../middlewares/planos.middleware.js";

const router = Router();

router.get("/", planoController.pegaTodos);
router.get("/:id", validarId, planoController.pegaUm);
router.post('/', validarCriarPlano, planoController.criarUm);
router.put('/:id', validarId, validarCriarPlano, planoController.atualizarUm);
router.delete('/:id', validarId, planoController.excluirUm);

export default router;