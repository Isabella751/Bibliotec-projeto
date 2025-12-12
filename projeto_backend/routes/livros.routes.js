import express from "express";
import {
    criarLivro,
    listarLivros,
    editarLivro,
    obterLivro,
    deletarLivro,
    registrarVisualizacao,  // ← NOVO
    obterDestaques          // ← NOVO
} from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/", listarLivros);
router.get("/destaques", obterDestaques);          // ← NOVO
router.get("/:id", obterLivro);
router.post("/", criarLivro);
router.post("/:id/visualizar", registrarVisualizacao); // ← NOVO
router.put("/:id", editarLivro);
router.delete("/:id", deletarLivro);

export default router;