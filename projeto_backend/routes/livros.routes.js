import express from "express"
import {
    criarLivro,
    listarLivros,
    editarLivro,
    obterLivro,
    deletarLivro
} from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/", listarLivros);
router.get("/:id", obterLivro);
router.post("/", criarLivro);
router.put("/:id", editarLivro);
router.delete("/:id", deletarLivro);

export default router;