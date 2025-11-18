import express from "express"
import {
    criarAvaliacao,
    listarAvaliacoes,
} from "../controllers/avaliacoes.controller.js";

const router = express.Router();

router.get("/", listarAvaliacoes);
router.post("/", criarAvaliacao);

export default router;