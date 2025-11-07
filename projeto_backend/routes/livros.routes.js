import express from "express"
import {
    criarLivro,
    // criarUsuario,
    listarLivros,
    obterUsuario
    // atualizarUsuario,
    // deletarUsuario
} from "../controllers/livro.controller.js";

const router = express.Router();

router.get("/", listarLivros);
router.post("/", criarLivro);
router.get("/:id", obterUsuario);
// router.put("/:id", atualizarUsuario);
// router.delete("/:id", deletarUsuario);

export default router;