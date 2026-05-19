// plano de estudo routes
import { Router } from "express";
import planoController from "./plano.controller.js";
import validar from "../../middlewares/planos.middleware.js";

const router = Router();

router.get("/", planoController.pegaTodos);
router.get("/:id", validar.validarId, planoController.pegaUm);
router.post('/', validar.validarCriarPlano, planoController.criarUm);
router.put('/:id', validar.validarId, validar.validarCriarPlano, planoController.atualizarUm);
router.delete('/:id', validar.validarId, planoController.excluirUm);

export default router;

//-