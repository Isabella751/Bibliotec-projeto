import express from "express";
import { solicitarRecuperacao, redefinirSenha } from "../controllers/redSenha.controller.js";

const router = express.Router();

router.post("/recuperar", solicitarRecuperacao);
router.post("/redefinir", redefinirSenha);

export default router;
