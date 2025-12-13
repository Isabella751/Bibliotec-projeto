import express from "express";
import {
    criarLivro,
    listarLivros,
    editarLivro,
    obterLivro,
    deletarLivro,
    registrarVisualizacao,  
    obterDestaques,
    buscarLivros
} from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/", listarLivros);
router.get('/busca', buscarLivros); 
router.get('/destaques', obterDestaques);
router.get('/livros/:id', obterLivro);
router.post("/", criarLivro);
router.post("/:id/visualizar", registrarVisualizacao);
router.put("/:id", editarLivro);
router.delete("/:id", deletarLivro);

export default router;