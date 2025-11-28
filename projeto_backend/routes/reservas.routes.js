import express from "express"
import {
    criarReservas,
    listarReservas,
    obterReservas,
    deletarReservas
} from "../controllers/reservas.controller.js";

const router = express.Router();

router.get("/", listarReservas);
router.get("/:id", obterReservas);
router.post("/", criarReservas);
router.delete("/:id", deletarReservas);

export default router;