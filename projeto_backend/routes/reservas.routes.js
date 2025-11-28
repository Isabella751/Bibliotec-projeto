import express from "express"
import {
    criarReservas,
    listarReservas,
    obterReservas,
    deletarReservas
} from "../controllers/reservas.controller.js";

import {
    adicionarItem,
    listarItensReserva,
    removerItem
} from "../controllers/reservaItens.controller.js";

const router = express.Router();

router.get("/", listarReservas);
router.get("/:id", obterReservas);
router.post("/", criarReservas);
router.delete("/:id", deletarReservas);

router.post("/itens", adicionarItem);
router.get("/itens/:reserva_id", listarItensReserva);
router.delete("/itens/:id", removerItem);

export default router;