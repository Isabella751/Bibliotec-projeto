import express from "express";
import {
    listarFavoritos,
    criarFavorito,
    excluirFavorito
} from "../controllers/favoritos.controller.js";

const router = express.Router();

router.get("/", listarFavoritos);
router.post("/", criarFavorito);
router.delete("/:usuario_id/:livro_id", excluirFavorito);

export default router;