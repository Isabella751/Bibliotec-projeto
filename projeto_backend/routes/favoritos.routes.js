import express from "express";
import {
    listarFavoritos,
    criarFavorito,
    excluirFavorito
} from "../controllers/favoritos.controller.js";

const router = express.Router();

router.get("/", listarFavoritos);
router.post("/", criarFavorito);
router.delete("/:id", excluirFavorito);

export default router;