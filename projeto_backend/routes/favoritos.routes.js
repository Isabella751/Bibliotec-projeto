import express from "express";
import {
    listarFavoritos,
    criarFavorito,
    excluirFavorito,
    verificarFavorito
} from "../controllers/favoritos.controller.js";

const router = express.Router();

router.get("/", listarFavoritos);
router.get("/verificar/:usuario_id/:livro_id", verificarFavorito);
router.post("/", criarFavorito);
router.delete("/:usuario_id/:livro_id", excluirFavorito);

export default router;